/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthState = {
  authenticated: boolean;
  loading: boolean;
};

type AuthContextValue = AuthState & {
  fetchMe: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function LegacyAuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const response = await fetch("http://localhost:4000/auth/me", {
      credentials: "include",
    });

    if (!response.ok) {
      setAuthenticated(false);
      throw new Error("Invalid credentials");
    }

    setAuthenticated(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }
    setAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    setAuthenticated(false);
    await fetch("http://localhost:4000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await fetchMe();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [fetchMe]);

  const value: AuthContextValue = {
    authenticated,
    loading,
    login,
    fetchMe,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
