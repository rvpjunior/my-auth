import { setAuthTokens } from "../utils/localStorage";
import { transformTokenResponse } from "../utils/transformTokenResponse";

export const exchangeTokenWithCode = async (code: string): Promise<boolean> => {
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
    return false;
  }

  const data = await response.json();
  const transformedData = transformTokenResponse(data);
  setAuthTokens(transformedData);
  return true;
};