import { jwtDecode, type JwtPayload } from "jwt-decode";

type DecodedIdToken = JwtPayload & {
  name: string;
};

export const getUserFromIdToken = (idToken: string) => {
  const decoded = jwtDecode<DecodedIdToken>(idToken);
  return {
    id: decoded.sub,
    name: decoded.name,
  };
};
