import { createContext, useContext, useState, ReactNode } from "react";
import api from "../api/axiosInstance";
import { AuthUser, Role } from "../types";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "customer" | "partner";
  phone?: string;
  town?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string, loginAs: Role) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  persistAuthUser: (authUser: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "talabaty_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (authUser: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  // loginAs is the tab the person clicked (Customer / Partner / Admin).
  // It's sent along so the backend can reject a mismatch — e.g. someone
  // with a customer account cannot log in through the Admin tab, even
  // with the correct password, because the account's real role differs.
  const login = async (email: string, password: string, loginAs: Role) => {
    const { data } = await api.post<AuthUser>("/auth/login", { email, password, role: loginAs });
    persist(data);
  };

  const register = async (input: RegisterInput) => {
    const { data } = await api.post<AuthUser>("/auth/register", input);
    persist(data);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, persistAuthUser: persist, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
