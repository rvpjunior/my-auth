import { useEffect, useState } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const accessToken = queryParams.get("access_token");

      if (accessToken) {
        window.localStorage.setItem("access_token", accessToken);
        window.history.replaceState({}, "", window.location.pathname);
        setIsLoading(false);
      } else {
        const accessToken = window.localStorage.getItem("access_token");
        if (!accessToken) {
          window.location.href =
            "http://localhost:3000/auth/login?returnTo=http://localhost:3001";
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
