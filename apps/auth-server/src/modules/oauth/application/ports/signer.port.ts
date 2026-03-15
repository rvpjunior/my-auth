export interface SignerPort {
  sign(sub: string, expiresIn: number, issuer: string): Promise<string>;
}
