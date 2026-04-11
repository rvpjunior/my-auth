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

export const getAuthState = () => {
  return window.localStorage.getItem("auth_state");
};

export const getAuthNonce = () => {
  return window.localStorage.getItem("auth_nonce");
};

export const setAuthState = () => {
  const randomState = crypto.randomUUID();
  window.localStorage.setItem("auth_state", randomState);
  return randomState;
};

export const setAuthNonce = () => {
  const randomNonce = crypto.randomUUID();
  window.localStorage.setItem("auth_nonce", randomNonce);
  return randomNonce;
};

export const removeAuthState = () => {
  window.localStorage.removeItem("auth_state");
};

export const removeAuthNonce = () => {
  window.localStorage.removeItem("auth_nonce");
};