export class AuthorizationCode {
  constructor(
    public readonly code: string,
    public readonly clientId: string,
    public readonly redirectUri: string,
    public readonly userId: string,
    public readonly expiresAt: Date,
  ) {}
}
