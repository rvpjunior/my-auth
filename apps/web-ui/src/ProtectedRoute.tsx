import { useEffect, useRef, useState } from "react";
import { getAuthTokens } from "./utils/localStorage";
import { redirectToLogin } from "./utils/redirectToLogin";
import { exchangeTokenWithRefreshToken } from "./requests/exchangeTokenWithRefreshToken";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const initCheckAuth = useRef<boolean>(false);

  useEffect(() => {


    const checkAuth = async () => {
      if(initCheckAuth.current) return;
      initCheckAuth.current = true;
      const authTokens = getAuthTokens();
      if (!authTokens) {
        redirectToLogin();
      } else {
        const { expires_at, access_token, refresh_token, id_token } = authTokens;

        if (!expires_at || !access_token || !refresh_token || !id_token) {
          redirectToLogin();
        } else if (expires_at < new Date().toISOString()) {
          const result = await exchangeTokenWithRefreshToken(refresh_token);
          if(!result) {
            redirectToLogin();
            return;
          }
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
