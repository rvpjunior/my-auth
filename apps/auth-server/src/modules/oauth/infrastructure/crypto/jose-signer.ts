import { Injectable } from '@nestjs/common';
import { SignerPort } from '@oauth/application/ports/signer.port';
import { importPKCS8, SignJWT } from 'jose';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class JoseSigner implements SignerPort {
  async sign(
    sub: string,
    expiresIn: number,
    issuer: string,
    name?: string,
  ): Promise<string> {
    const privateKeyPem = readFileSync(
      join(process.cwd(), 'certs', 'jwt-private.pem'),
      'utf8',
    );

    const expirationTime = new Date(Date.now() + expiresIn * 1000);
    const expirationTimeInSeconds = Math.floor(expirationTime.getTime() / 1000);

    const privateKey = await importPKCS8(privateKeyPem, 'RS256');
    const token = await new SignJWT({ sub, iss: issuer, name })
      .setProtectedHeader({ alg: 'RS256' })
      .setExpirationTime(expirationTimeInSeconds)
      .setIssuedAt()
      .sign(privateKey);

    return token;
  }
}
