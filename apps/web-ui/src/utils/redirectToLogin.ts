import {
  removeAuthTokens,
  setAuthNonce,
  setAuthReturnTo,
  setAuthState,
} from "./localStorage";

export const redirectToLogin = () => {
  removeAuthTokens();
  const state = setAuthState();
  const nonce = setAuthNonce();
  setAuthReturnTo(window.location.href);
  window.location.href = `http://localhost:4000/oauth/authorize?clientId=123&redirectUri=http://localhost:3000/callback&responseType=code&scope=openid%20profile&state=${state}&nonce=${nonce}`;
};
