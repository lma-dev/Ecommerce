import { getSession, signOut } from "next-auth/react";
import axios from "@/libs/axios";
import ToastAlert from "@/app/[locale]/_components/ui/toast-box";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ResponseType = "arraybuffer" | "blob" | "document" | "json" | "text";

interface CallApiParams<TBody = unknown> {
  method: HttpMethod;
  url: string;
  data?: TBody;
  responseType?: ResponseType;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await getSession();
  const token = session?.user.token;

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function handleSuccess<T>(response: { data: T }) {
  return response.data;
}

async function handleError(error: any) {
  if (error.response?.status === 401) {
    ToastAlert.error({ message: "Session expired. Please login again." });
    await signOut({ redirect: true, callbackUrl: "/login" });
    return;
  }

  if (error.response?.data?.errors) {
    const errorMessages = Object.values(error.response.data.errors).flat();
    errorMessages.forEach((msg) => ToastAlert.error({ message: msg }));
    throw new Error("Validation errors occurred");
  }

  if (error.request) {
    ToastAlert.error({ message: "No response received: " + error.request });
    throw new Error("No response received");
  }

  ToastAlert.error({ message: "Error: " + error.message });
  throw new Error(error.message);
}

export async function callApi<TResponse = unknown, TBody = unknown>({
  method,
  url,
  data,
  responseType = "json",
}: CallApiParams<TBody>): Promise<TResponse> {
  try {
    const headers = await getAuthHeaders();
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const requestHeaders: Record<string, string> = { ...headers };

    if (!isFormData) {
      requestHeaders["Content-Type"] =
        requestHeaders["Content-Type"] || "application/json";
    }

    const response = await axios.request<TResponse>({
      method,
      url,
      data,
      responseType,
      headers: requestHeaders,
    });

    return handleSuccess(response);
  } catch (error) {
    return (await handleError(error)) as TResponse;
  }
}
