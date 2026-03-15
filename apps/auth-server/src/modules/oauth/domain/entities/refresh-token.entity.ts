export class RefreshToken {
  constructor(
    public readonly token: string,
    public readonly clientId: string,
    public readonly userId: string,
    public readonly expiresAt: Date,
  ) {}
}
