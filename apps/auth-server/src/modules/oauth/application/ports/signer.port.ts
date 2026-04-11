export interface SignerPort {
  sign(
    sub: string,
    expiresIn: number,
    issuer: string,
    name?: string,
  ): Promise<string>;
}
