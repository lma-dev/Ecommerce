import axios from "@/libs/axios";
import { ensureSanctumCookie } from "@/libs/sanctum";

export type CustomerLoginInput = { email: string; password: string }
export type CustomerLoginResponse = {
  token?: string
  data?: { token?: string }
  user?: any
}

export const customerLogin = async (
  payload: CustomerLoginInput,
): Promise<CustomerLoginResponse> => {
  await ensureSanctumCookie();
  const res = await axios.post("/customer/login", payload);
  return res.data;
};
