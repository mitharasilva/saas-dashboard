import { createContext } from "react";
import type { AuthResponse } from "../types";

export interface AuthContextType {
  isAuthenticated: boolean;
  clientName: string;
  planTier: string;
  signIn: (data: AuthResponse) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);