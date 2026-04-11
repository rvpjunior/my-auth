import { getUserFromIdToken } from "./getUserFromIdToken";

export const transformTokenResponse = (
  data: Record<string, string | number>
) => {
  const expiresInSeconds = Number(data.expires_in);
  const user = data.id_token
    ? getUserFromIdToken(String(data.id_token))
    : undefined;
  return {
    access_token: data.access_token,
    expires_at: new Date(Date.now() + expiresInSeconds * 1000).toISOString(),
    refresh_token: data.refresh_token,
    id_token: data.id_token,
    user,
  };
};
