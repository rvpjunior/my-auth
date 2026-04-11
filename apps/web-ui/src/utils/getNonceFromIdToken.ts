import { jwtDecode, type JwtPayload } from "jwt-decode";

type DecodedIdToken = JwtPayload & {
  nonce: string;
};

export const getNonceFromIdToken = (idToken: string) => {
  const decoded = jwtDecode<DecodedIdToken>(idToken);
  return decoded.nonce;
};
