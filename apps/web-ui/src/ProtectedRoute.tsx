import { useEffect, useState } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const redirectToLogin = () => {
      window.location.href =
        "http://localhost:4000/oauth/authorize?clientId=123&redirectUri=http://localhost:3000&responseType=code";
    };

    const checkAuth = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get("code");

      if (code) {
        const response = await fetch("http://localhost:4000/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "http://localhost:3000",
          }),
        });
        const data = await response.json();

        window.localStorage.setItem(
          "auth_tokens",
          JSON.stringify({
            access_token: data.access_token,
            expires_at: new Date(
              Date.now() + data.expires_in * 1000
            ).toISOString(),
          })
        );
        window.history.replaceState({}, "", window.location.pathname);
        setIsLoading(false);
      } else {
        const authTokens = window.localStorage.getItem("auth_tokens");
        if (!authTokens) {
          redirectToLogin();
        } else {
          const { expires_at, access_token } = JSON.parse(authTokens);
          if (!expires_at || !access_token) {
            window.localStorage.removeItem("auth_tokens");
            redirectToLogin();
          } else if (expires_at < new Date().toISOString()) {
            window.localStorage.removeItem("auth_tokens");
            redirectToLogin();
          } else {
            setIsLoading(false);
          }
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
