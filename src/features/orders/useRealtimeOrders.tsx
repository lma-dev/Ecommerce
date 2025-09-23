"use client";

import Pusher from "pusher-js";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import Echo, { type EchoOptions } from "laravel-echo";

const escapeRegex = (value: string) =>
  value.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");

const readCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const pattern = new RegExp(`(?:^|;\\s*)${escapeRegex(name)}=([^;]*)`);
  const match = document.cookie.match(pattern);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
};

type RealtimeEvent = {
  type: "order.created" | "order.updated" | "order.deleted";
  payload: any;
};

type RealtimeOpts = {
  orderId?: number;
  customerId?: number;
  includeGlobalChannel?: boolean;
};

export function useRealtimeOrders(opts?: RealtimeOpts) {
  const qc = useQueryClient();

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY as string | undefined;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string | undefined;
  const channelName =
    (process.env.NEXT_PUBLIC_PUSHER_ORDERS_CHANNEL as string | undefined) ||
    "orders";
  const extraChannel = process.env.NEXT_PUBLIC_PUSHER_EXTRA_CHANNEL as
    | string
    | undefined;
  const extraEvent = process.env.NEXT_PUBLIC_PUSHER_EXTRA_EVENT as
    | string
    | undefined;
  const debug =
    String(process.env.NEXT_PUBLIC_ECHO_DEBUG || "").toLowerCase() === "true";
  const logDebug = debug
    ? (...args: unknown[]) => console.debug("[Realtime]", ...args)
    : () => undefined;
  const privateEnv = process.env.NEXT_PUBLIC_ECHO_PRIVATE;
  const enablePrivate =
    privateEnv === undefined || privateEnv === ""
      ? true
      : String(privateEnv).toLowerCase() === "true";
  const useTokenAuth =
    String(process.env.NEXT_PUBLIC_ECHO_TOKEN_AUTH || "").toLowerCase() ===
    "true";
  const sanctumEnv = process.env.NEXT_PUBLIC_ECHO_SANCTUM;
  const enableSanctum =
    sanctumEnv === undefined || sanctumEnv === ""
      ? true
      : String(sanctumEnv).toLowerCase() === "true";
  const sanctumEndpoint =
    (process.env.NEXT_PUBLIC_ECHO_SANCTUM_ENDPOINT as string | undefined) ||
    "/sanctum/csrf-cookie";
  const sanctumCookieName =
    (process.env.NEXT_PUBLIC_ECHO_SANCTUM_COOKIE as string | undefined) ||
    "XSRF-TOKEN";
  const customerTokenCookie = "customer_token";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!key || !cluster) return; // no-op if not configured
    if (!enablePrivate) {
      if (debug)
        console.warn(
          "[Realtime] Private channels disabled via NEXT_PUBLIC_ECHO_PRIVATE; no subscriptions created"
        );
      return;
    }

    const handle = (evt: RealtimeEvent | any) => {
      logDebug("Event received", evt);
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["customer", "orders"] });
      const id = (evt?.payload?.id ?? evt?.id) as number | undefined;
      if (opts?.orderId && id === opts.orderId) {
        qc.invalidateQueries({ queryKey: ["order", opts.orderId] });
      }
      if (id != null) {
        qc.invalidateQueries({ queryKey: ["customer", "orders", id] });
        qc.invalidateQueries({
          queryKey: ["customer", "orders", String(id)],
        });
      }
    };

    const bindCommonEvents = (ch: any) => {
      // Laravel broadcastAs variants
      ch.listen("order.created", handle);
      ch.listen(".order.created", handle);
      ch.listen("order.updated", handle);
      ch.listen(".order.updated", handle);
      ch.listen("order.deleted", handle);
      ch.listen(".order.deleted", handle);
      // Class-name variants
      ch.listen(".OrderCreated", handle);
      ch.listen("OrderCreated", handle);
      ch.listen("App\\Events\\OrderCreated", handle);
      ch.listen(".App\\Events\\OrderCreated", handle);
      ch.listen(".OrderUpdated", handle);
      ch.listen("OrderUpdated", handle);
      ch.listen("App\\Events\\OrderUpdated", handle);
      ch.listen(".App\\Events\\OrderUpdated", handle);
      ch.listen(".OrderDeleted", handle);
      ch.listen("OrderDeleted", handle);
      ch.listen("App\\Events\\OrderDeleted", handle);
      ch.listen(".App\\Events\\OrderDeleted", handle);
    };

    let echoInstance: Echo<"pusher"> | null = null;
    const subscribedChannels = new Set<string>();
    let cancelled = false;
    let sanctumReady = !!readCookie(sanctumCookieName);
    let sanctumPromise: Promise<void> | null = null;
    let resolvedSanctumEndpoint: string | null = null;

    const buildAuthEndpoint = (base?: string) => {
      if (!base) return undefined;
      return `${base.replace(/\/$/, "")}/broadcasting/auth`;
    };

    const authEndpoint =
      process.env.NEXT_PUBLIC_PUSHER_AUTH_ENDPOINT ||
      buildAuthEndpoint(
        process.env.NEXT_PUBLIC_BACKEND_URL as string | undefined
      ) ||
      buildAuthEndpoint(
        process.env.NEXT_PUBLIC_API_BASE_URL as string | undefined
      );

    const resolveSanctumEndpoint = () => {
      if (!enableSanctum) return null;
      if (resolvedSanctumEndpoint !== null) return resolvedSanctumEndpoint;
      const candidate = sanctumEndpoint?.trim() || "/sanctum/csrf-cookie";

      try {
        const baseUrl = authEndpoint
          ? new URL(authEndpoint, window.location.href)
          : new URL(window.location.href);
        resolvedSanctumEndpoint = new URL(candidate, baseUrl.origin).toString();
      } catch {
        resolvedSanctumEndpoint = candidate;
      }

      logDebug("Resolved Sanctum endpoint", resolvedSanctumEndpoint);
      return resolvedSanctumEndpoint;
    };

    const ensureSanctum = async () => {
      if (!enableSanctum) return;
      if (sanctumReady) {
        logDebug("Sanctum already ready");
        return;
      }

      const existing = readCookie(sanctumCookieName);
      if (existing) {
        logDebug("Sanctum cookie already present");
        sanctumReady = true;
        return;
      }

      const endpoint = resolveSanctumEndpoint();
      if (!endpoint) return;
      if (sanctumPromise) {
        logDebug("Sanctum request in progress");
        return sanctumPromise;
      }

      logDebug("Fetching Sanctum CSRF cookie", endpoint);

      sanctumPromise = fetch(endpoint, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`CSRF cookie request failed (${res.status})`);
          }
          logDebug("Sanctum CSRF fetch succeeded");
          sanctumReady = true;
        })
        .catch((error) => {
          logDebug("Sanctum CSRF fetch failed", error);
        })
        .finally(() => {
          sanctumPromise = null;
        });

      return sanctumPromise;
    };

    const setup = async () => {
      (window as any).Pusher = Pusher;

      try {
        const log = String(
          process.env.NEXT_PUBLIC_PUSHER_LOG || ""
        ).toLowerCase();
        if (log === "true" || log === "1" || log === "yes") {
          (Pusher as any).logToConsole = true;
        }
      } catch {}

      const headers: Record<string, string> = {};

      if (useTokenAuth) {
        try {
          const session = await getSession();
          const token = (session as any)?.user?.token as string | undefined;
          logDebug("Session token lookup", token ? "found" : "missing");
          if (token) {
            headers.Authorization = `Bearer ${token}`;
            logDebug("Session token detected");
          }
        } catch (error) {
          logDebug("Failed to resolve session token", error);
        }
      }

      if (!headers.Authorization) {
        const customerToken = readCookie(customerTokenCookie);
        if (customerToken) {
          headers.Authorization = `Bearer ${customerToken}`;
          logDebug("Customer token detected");
        }
      }

      const hasBearer = Boolean(headers.Authorization?.startsWith("Bearer "));

      if (cancelled) return;

      const config: EchoOptions<"pusher"> = {
        broadcaster: "pusher",
        key,
        cluster,
        forceTLS: true,
        withCredentials: !hasBearer,
      };

      if (authEndpoint) config.authEndpoint = authEndpoint;
      if (Object.keys(headers).length) config.auth = { headers };
      if (hasBearer) {
        config.bearerToken = headers.Authorization.slice("Bearer ".length);
        logDebug("Bearer token set on Echo config");
      }

      const shouldUseSanctum = enableSanctum && !hasBearer;

      if (shouldUseSanctum) {
        const xsrf = readCookie(sanctumCookieName);
        if (xsrf) {
          config.csrfToken = xsrf;
          logDebug("CSRF token set on Echo config");
        } else {
          logDebug("CSRF token missing when configuring Echo");
        }
      }

      if (authEndpoint) {
        (config as any).authorizer = (channel: { name: string }) => ({
          authorize: async (socketId: string, callback: any) => {
            try {
              if (shouldUseSanctum) {
                await ensureSanctum();
              }

              const requestHeaders: Record<string, string> = {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
                ...headers,
              };

              if (shouldUseSanctum) {
                const xsrf = readCookie(sanctumCookieName);
                if (xsrf) requestHeaders["X-XSRF-TOKEN"] = xsrf;
                logDebug("Authorizer using Sanctum cookie");
              } else {
                logDebug("Sanctum disabled for authorizer");
              }

              logDebug("Authorizing channel", channel.name);
              const res = await fetch(authEndpoint, {
                method: "POST",
                headers: requestHeaders,
                credentials: shouldUseSanctum ? "include" : "omit",
                body: JSON.stringify({
                  socket_id: socketId,
                  channel_name: channel.name,
                }),
              });

              if (!res.ok) {
                const bodyText = await res.text().catch(() => "");
                throw new Error(
                  `Auth failed (${res.status})${bodyText ? `: ${bodyText}` : ""}`
                );
              }

              const data = await res.json();
              logDebug("Authorization success", channel.name);
              callback(false, data);
            } catch (error) {
              logDebug(`Authorization failed for ${channel.name}`, error);
              const message =
                (error as any)?.message !== undefined
                  ? (error as any).message
                  : String(error);
              callback(true, message);
            }
          },
        });
      }

      echoInstance = new Echo<"pusher">(config);

      const subscribeChannel = <
        T extends { listen: (event: string, cb: any) => T },
      >(
        factory: () => T,
        leaveName: string,
        label: string
      ): T | null => {
        if (!echoInstance) return null;
        try {
          const ch = factory();
          if (!ch) return null;
          bindCommonEvents(ch);
          subscribedChannels.add(leaveName);
          logDebug(`Subscribed to ${label}`);
          return ch;
        } catch (error) {
          if (debug)
            console.warn(`[Realtime] Subscribe failed (${label})`, error);
          return null;
        }
      };

      const shouldJoinGlobal = opts?.includeGlobalChannel !== false;

      if (shouldJoinGlobal) {
        subscribeChannel(
          () => echoInstance!.private(channelName),
          channelName,
          `private:${channelName}`
        );
      }

      if (opts?.orderId) {
        const scopedChannel = `${channelName}.${opts.orderId}`;
        subscribeChannel(
          () => echoInstance!.private(scopedChannel),
          scopedChannel,
          `private:${scopedChannel}`
        );
      }

      if (opts?.customerId) {
        const customerChannel = `${channelName}.customer.${opts.customerId}`;
        subscribeChannel(
          () => echoInstance!.private(customerChannel),
          customerChannel,
          `private:${customerChannel}`
        );
      }

      if (extraChannel && extraEvent) {
        const chExtra = subscribeChannel(
          () => echoInstance!.private(extraChannel),
          extraChannel,
          `private:${extraChannel}`
        );
        chExtra?.listen(extraEvent, handle);
      }
    };

    setup();

    return () => {
      cancelled = true;
      try {
        if (echoInstance) {
          subscribedChannels.forEach((name) => {
            try {
              echoInstance!.leave(name);
            } catch {}
          });
          echoInstance.disconnect();
        }
      } catch {}
    };
  }, [
    qc,
    opts?.orderId,
    opts?.customerId,
    opts?.includeGlobalChannel,
    key,
    cluster,
    channelName,
    extraChannel,
    extraEvent,
    debug,
    enablePrivate,
    useTokenAuth,
    enableSanctum,
    sanctumEndpoint,
    sanctumCookieName,
  ]);
}

export function RealtimeOrdersListener(props?: { orderId?: number }) {
  useRealtimeOrders({ orderId: props?.orderId });
  return null;
}
