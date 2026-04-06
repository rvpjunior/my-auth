import { useEffect, useRef, useState } from "react";

export const Callback = () => {
  const [error, setError] = useState<boolean>(false);
  const initTokenRequest = useRef<boolean>(false);

  useEffect(() => {
    if(initTokenRequest.current) return;
    initTokenRequest.current = true;
    const handleCallback = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get("code");

      if (code) {
        window.history.replaceState({}, "", window.location.pathname);
        const response = await fetch("http://localhost:4000/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "http://localhost:3000/callback",
            client_id: "123",
          }),
          credentials: "include",
        });

        if(!response.ok) {
          setError(true);
          return;
        }

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

        const returnTo = window.localStorage.getItem("auth_return_to");
        if(returnTo) {
          window.localStorage.removeItem("auth_return_to");
          window.location.href = returnTo;
        } else {
          window.location.href = "/";
        }
        
      }
    };
    handleCallback();
  }, []);

  if(error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-400">Ops! Something went wrong. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <p className="text-slate-400">Loading...</p>
    </div>
  );
};
