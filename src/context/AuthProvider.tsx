import { useState } from "react";
import type { ReactNode } from "react";
import type { AuthResponse } from "../types";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("access_token"),
  );
  const [clientName, setClientName] = useState(
    () => localStorage.getItem("client_name") ?? "",
  );
  const [planTier, setPlanTier] = useState(
    () => localStorage.getItem("plan_tier") ?? "",
  );

  const signIn = (data: AuthResponse) => {
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("refresh_token", data.refreshToken);
    localStorage.setItem("client_name", data.clientName);
    localStorage.setItem("plan_tier", data.planTier);
    setIsAuthenticated(true);
    setClientName(data.clientName);
    setPlanTier(data.planTier);
  };

  const signOut = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setClientName("");
    setPlanTier("");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, clientName, planTier, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
