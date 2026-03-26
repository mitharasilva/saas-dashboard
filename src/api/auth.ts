import api from "./axios";
import type { AuthResponse, LoginRequest } from "../types/index.ts";

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/login", data);
  return res.data;
}
