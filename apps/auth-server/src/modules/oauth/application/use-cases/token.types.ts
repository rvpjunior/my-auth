export type AuthorizationCodeTokenRequest = {
  grant_type: 'authorization_code';
  code: string;
  redirect_uri: string;
  client_id: string;
};

export type RefreshTokenTokenRequest = {
  grant_type: 'refresh_token';
  refresh_token: string;
  client_id: string;
};

export type TokenRequest =
  | AuthorizationCodeTokenRequest
  | RefreshTokenTokenRequest;

export type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
};
