import { callApi } from "@/libs/callApi";

const defaultRoute = "/app";

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
  return await callApi({ method: "PUT", url: defaultRoute + url, data });
}
