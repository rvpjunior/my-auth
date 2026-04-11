export type DBSchema = {
  users: {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
  }[];
  clients: {
    id: string;
    name: string;
    clientSecret: string;
    redirectUris: string[];
  }[];
  authorizationCodes: {
    code: string;
    clientId: string;
    redirectUri: string;
    userId: string;
    expiresAt: Date;
    scope?: string;
    nonce: string;
  }[];
  sessions: {
    id: string;
    userId: string;
    expiresAt: Date;
  }[];
  refreshTokens: {
    token: string;
    clientId: string;
    userId: string;
    expiresAt: Date;
    scope?: string;
  }[];
};
