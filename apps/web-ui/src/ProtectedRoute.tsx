import { useEffect, useState } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get("code");

      if (code) {
        window.localStorage.setItem("code", code);
        window.history.replaceState({}, "", window.location.pathname);
        setIsLoading(false);
      } else {
        const code = window.localStorage.getItem("code");
        if (!code) {
          window.location.href =
            "http://localhost:4000/oauth/authorize?clientId=123&redirectUri=http://localhost:3000&responseType=code";
        } else {
          setIsLoading(false);
        }
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return children;
};
