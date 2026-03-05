export type DBSchema = {
  users: {
    id: string;
    email: string;
    passwordHash: string;
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
  }[];
  sessions: {
    id: string;
    userId: string;
    expiresAt: Date;
  }[];
};
