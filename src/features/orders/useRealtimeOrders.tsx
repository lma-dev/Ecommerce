"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

type RealtimeEvent = {
  type: "order.created" | "order.updated" | "order.deleted";
  payload: any;
};

async function getPusher() {
  try {
    const mod = await import("pusher-js");
    return (mod as any).default || (mod as any);
  } catch {
    return null;
  }
}

export function useRealtimeOrders(opts?: { orderId?: number }) {
  const qc = useQueryClient();

  useEffect(() => {
    let pusher: any;
    let channel: any;
    let mounted = true;

    const key = process.env.NEXT_PUBLIC_PUSHER_KEY as string | undefined;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string | undefined;
    const channelName = (process.env.NEXT_PUBLIC_PUSHER_ORDERS_CHANNEL as string | undefined) || "orders";

    if (!key || !cluster) return; // no-op if not configured

    (async () => {
      const Pusher = await getPusher();
      if (!Pusher || !mounted) return;
      pusher = new Pusher(key, { cluster, forceTLS: true });
      channel = pusher.subscribe(channelName);

      const handle = (evt: RealtimeEvent | any) => {
        qc.invalidateQueries({ queryKey: ["orders"] });
        const id = (evt?.payload?.id ?? evt?.id) as number | undefined;
        if (opts?.orderId && id === opts.orderId) {
          qc.invalidateQueries({ queryKey: ["order", opts.orderId] });
        }
      };

      channel.bind("order.created", handle);
      channel.bind("order.updated", handle);
      channel.bind("order.deleted", handle);
    })();

    return () => {
      mounted = false;
      try {
        if (channel) {
          channel.unbind("order.created");
          channel.unbind("order.updated");
          channel.unbind("order.deleted");
        }
        if (pusher && channel) pusher.unsubscribe(channel.name);
        if (pusher) pusher.disconnect();
      } catch {}
    };
  }, [qc, opts?.orderId]);
}

export function RealtimeOrdersListener(props?: { orderId?: number }) {
  useRealtimeOrders({ orderId: props?.orderId });
  return null;
}

