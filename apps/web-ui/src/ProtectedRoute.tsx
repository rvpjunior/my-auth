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
            client_id: "123",
          }),
        });
        const data = await response.json();

        const expiresInSeconds = data.expires_in;

        window.localStorage.setItem(
          "auth_tokens",
          JSON.stringify({
            access_token: data.access_token,
            expires_at: new Date(
              Date.now() + expiresInSeconds * 1000
            ).toISOString(),
            refresh_token: data.refresh_token,
          })
        );
        window.history.replaceState({}, "", window.location.pathname);
        setIsLoading(false);
      } else {
        const authTokens = window.localStorage.getItem("auth_tokens");
        if (!authTokens) {
          redirectToLogin();
        } else {
          const { expires_at, access_token, refresh_token } =
            JSON.parse(authTokens);
          if (!expires_at || !access_token || !refresh_token) {
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
            });
            const data = await response.json();
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
