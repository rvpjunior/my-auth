export const setAuthReturnTo = (returnTo: string) => {
  window.localStorage.setItem("auth_return_to", returnTo);
};

export const getAuthReturnTo = () => {
  return window.localStorage.getItem("auth_return_to");
};

export const removeAuthReturnTo = () => {
  window.localStorage.removeItem("auth_return_to");
};

export const setAuthTokens = (token: object) => {
  window.localStorage.setItem("auth_tokens", JSON.stringify(token));
};

export const getAuthTokens = () => {
  return JSON.parse(window.localStorage.getItem("auth_tokens") || "{}");
};

export const removeAuthTokens = () => {
  window.localStorage.removeItem("auth_tokens");
};

export const getUser = () => {
  const authTokens = getAuthTokens();
  return authTokens.user;
};
