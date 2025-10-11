import { callApi } from "@/libs/callApi";

const defaultRoute = "/staff";

export async function fetchAllData<TResponse = unknown>(url: string) {
  return await callApi<TResponse>({ method: "GET", url: defaultRoute + url });
}
export async function fetchSearchData<TResponse = unknown>(url: string, searchParams: any) {
  return await callApi<TResponse>({ method: "GET", url: defaultRoute + url, data: searchParams });
}

export async function fetchSingleData<TResponse = unknown>(url: string) {
  return await callApi<TResponse>({ method: "GET", url: defaultRoute + url });
}

export async function exportData<TResponse = unknown>(url: string) {
  return await callApi<TResponse>({
    method: "GET",
    url: defaultRoute + url,
    responseType: "arraybuffer",
  });
}

export async function deleteSingleData(url: string) {
  return await callApi({ method: "DELETE", url: defaultRoute + url });
}

export async function createData<TResponse = unknown>(url: string, data: any) {
  return await callApi<TResponse>({ method: "POST", url: defaultRoute + url, data });
}

export async function editData<TResponse = unknown>(url: string, data: any) {
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

  if (isFormData) {
    // Use method override so Laravel correctly parses multipart bodies
    if (!data.has("_method")) data.append("_method", "PUT");
    return await callApi<TResponse>({ method: "POST", url: defaultRoute + url, data });
  }

  return await callApi<TResponse>({ method: "PUT", url: defaultRoute + url, data });
}

// For sending FormData (e.g., with file uploads)
// Use this for endpoints that specifically require FormData
//If we use normal PUT/POST with FormData, Laravel may not parse it correctly
//So we use POST with a method override for PUT
export async function createFormData<TResponse = unknown>(url: string, formData: FormData) {
  return await callApi<TResponse>({ method: "POST", url: defaultRoute + url, data: formData });
}
