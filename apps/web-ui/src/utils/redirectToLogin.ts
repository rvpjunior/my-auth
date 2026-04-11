import { removeAuthTokens, setAuthReturnTo } from "./localStorage";

export const redirectToLogin = () => {
  removeAuthTokens();
  setAuthReturnTo(window.location.href);
  window.location.href =
    "http://localhost:4000/oauth/authorize?clientId=123&redirectUri=http://localhost:3000/callback&responseType=code&scope=openid%20profile";
};
