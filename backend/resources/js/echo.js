import Echo from "laravel-echo";

import Pusher from "pusher-js";
window.Pusher = Pusher;

const key = import.meta.env.VITE_REVERB_APP_KEY;
const host = import.meta.env.VITE_REVERB_HOST;
const port = Number(import.meta.env.VITE_REVERB_PORT ?? 443);
const useTlsEnv = (import.meta.env.VITE_REVERB_USE_TLS ?? "true").toString();
const forceTLS = !["0", "false", "no"].includes(useTlsEnv.toLowerCase());

window.Echo = new Echo({
    broadcaster: "reverb",
    key,
    forceTLS,
    wsHost: host,
    wsPort: port,
    wssPort: port,
    enabledTransports: ["ws", "wss"],
});
