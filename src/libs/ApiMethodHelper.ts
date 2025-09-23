import { callApi } from "@/libs/callApi";

const defaultRoute = "/staff";

export async function fetchAllData(url: string) {
  return await callApi({ method: "GET", url: defaultRoute + url });
}
export async function fetchSearchData(url: string, searchParams: any) {
  return await callApi({ method: "GET", url: defaultRoute + url, data: searchParams });
}

export async function fetchSingleData(url: string) {
  return await callApi({ method: "GET", url: defaultRoute + url });
}

export async function exportData(url: string) {
  return await callApi({ method: "GET", url: defaultRoute + url, responseType: "arraybuffer" });
}

export async function deleteSingleData(url: string) {
  return await callApi({ method: "DELETE", url: defaultRoute + url });
}

export async function createData(url: string, data: any) {
  return await callApi({ method: "POST", url: defaultRoute + url, data });
}

export async function editData(url: string, data: any) {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

  if (isFormData) {
    // Use method override so Laravel correctly parses multipart bodies
    if (!data.has('_method')) data.append('_method', 'PUT');
    return await callApi({ method: "POST", url: defaultRoute + url, data });
  }

  return await callApi({ method: "PUT", url: defaultRoute + url, data });
}

// For sending FormData (e.g., with file uploads)
// Use this for endpoints that specifically require FormData
//If we use normal PUT/POST with FormData, Laravel may not parse it correctly
//So we use POST with a method override for PUT
export async function createFormData(url: string, formData: FormData) {
  return await callApi({ method: "POST", url: defaultRoute + url, data: formData });
}
