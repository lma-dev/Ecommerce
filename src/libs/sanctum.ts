import Axios from "axios";

const cookieName = process.env.NEXT_PUBLIC_ECHO_SANCTUM_COOKIE || "XSRF-TOKEN";
const defaultBase = process.env.NEXT_PUBLIC_BACKEND_URL || "";
const endpointFromEnv = process.env.NEXT_PUBLIC_ECHO_SANCTUM_ENDPOINT;
const debugEnabled =
  String(process.env.NEXT_PUBLIC_ECHO_DEBUG || "").toLowerCase() === "true";

const trimTrailingSlash = (value: string) => value.replace(/\/$/, "");

const resolveEndpoint = () => {
  if (endpointFromEnv) return endpointFromEnv;
  if (defaultBase) return `${trimTrailingSlash(defaultBase)}/sanctum/csrf-cookie`;
  return `/sanctum/csrf-cookie`;
};

const readCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((segment) => segment.startsWith(`${name}=`));
  if (!raw) return null;
  const value = raw.split("=")[1] ?? "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const hasCookie = () => readCookie(cookieName) !== null;

export const getXsrfToken = () => readCookie(cookieName);

let inflight: Promise<void> | null = null;

export const ensureSanctumCookie = async (force = false) => {
  if (typeof window === "undefined") return;
  if (!force && hasCookie()) return;
  if (inflight) return inflight;

  inflight = Axios.get(resolveEndpoint(), {
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then(() => undefined)
    .catch((error) => {
      if (debugEnabled) console.warn("[Sanctum] CSRF cookie fetch failed", error);
      throw error;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
};
