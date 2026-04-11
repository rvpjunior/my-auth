import { setAuthTokens } from "../utils/localStorage";
import { transformTokenResponse } from "../utils/transformTokenResponse";

export const exchangeTokenWithRefreshToken = async (refreshToken: string): Promise<boolean> => {
  const response = await fetch("http://localhost:4000/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
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