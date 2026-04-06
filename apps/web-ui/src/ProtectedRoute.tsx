import { useEffect, useRef, useState } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const initCheckAuth = useRef<boolean>(false);

  useEffect(() => {
    const redirectToLogin = () => {
      window.location.href =
        "http://localhost:4000/oauth/authorize?clientId=123&redirectUri=http://localhost:3000/callback&responseType=code";
    };

    const checkAuth = async () => {
      if(initCheckAuth.current) return;
      initCheckAuth.current = true;
      const authTokens = window.localStorage.getItem("auth_tokens");
      if (!authTokens) {
        window.localStorage.setItem("auth_return_to", window.location.href);
        redirectToLogin();
      } else {
        const { expires_at, access_token, refresh_token } =
          JSON.parse(authTokens);

        if (!expires_at || !access_token || !refresh_token) {
          window.localStorage.setItem("auth_return_to", window.location.href);
          window.localStorage.removeItem("auth_tokens");
          redirectToLogin();
        } else if (expires_at < new Date().toISOString()) {
          const response = await fetch("http://localhost:4000/oauth/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              grant_type: "refresh_token",
              refresh_token: refresh_token,
              client_id: "123",
            }),
            credentials: "include",
          });
          const data = await response.json();
          if(!response.ok) {
            window.localStorage.removeItem("auth_tokens");
            window.localStorage.setItem("auth_return_to", window.location.href);
            redirectToLogin();
            return;
          }
          const expiresInSeconds = data.expires_in;
          window.localStorage.setItem(
            "auth_tokens",
            JSON.stringify({
              access_token: data.access_token,
              expires_at: new Date(
                Date.now() + expiresInSeconds * 1000
              ).toISOString(),
              refresh_token: refresh_token,
            })
          );
          setIsLoading(false);
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
