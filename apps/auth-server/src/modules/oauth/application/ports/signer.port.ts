export interface SignerPort {
  sign(
    sub: string,
    expiresIn: number,
    issuer: string,
    name?: string,
    nonce?: string,
  ): Promise<string>;
}
