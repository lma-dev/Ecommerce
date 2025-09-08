import { getSession, signOut } from "next-auth/react";
import axios from "@/libs/axios";
import ToastAlert from "@/app/[locale]/_components/ui/toast-box";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ResponseType = "arraybuffer" | "blob" | "document" | "json" | "text";

interface CallApiParams {
    method: HttpMethod;
    url: string;
    data?: any;
    responseType?: ResponseType;
}

async function getAuthHeaders() {
    const session = await getSession();
    const token = session?.user.token;

    return {
        Authorization: `Bearer ${token}`,
    };
}

function handleSuccess(response: any) {
    const { status, data } = response;

    if ((status === 200 || status === 201) && data?.msg && data?.alertVisible === true) {
        console.log("API call successful:");
    }

    return data;
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

export async function callApi({ method, url, data, responseType = "json" }: CallApiParams) {
    try {
        const headers = await getAuthHeaders();
        // Only set Content-Type for JSON, not FormData
        const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
        const config = {
            method,
            url,
            data,
            responseType,
            headers: isFormData ? headers : { ...headers, 'Content-Type': 'application/json' },
        };

        const response = await axios(config);
        return handleSuccess(response);
    } catch (error) {
        return await handleError(error);
    }
}
