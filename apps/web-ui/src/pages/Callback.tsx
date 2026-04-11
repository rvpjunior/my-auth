import { useEffect, useRef, useState } from "react";
import { exchangeTokenWithCode } from "../requests/exchangeTokenWithCode";
import { getAuthReturnTo, removeAuthReturnTo } from "../utils/localStorage";

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
        const result = await exchangeTokenWithCode(code);
        if(!result) {
          setError(true);
          return;
        }

        const returnTo = getAuthReturnTo();
        if(returnTo) {
          removeAuthReturnTo();
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
