export type PostTokenRequestDto =
  | {
      grant_type: 'authorization_code';
      code: string;
      redirect_uri: string;
      client_id: string;
    }
  | {
      grant_type: 'refresh_token';
      refresh_token: string;
      client_id: string;
    };
