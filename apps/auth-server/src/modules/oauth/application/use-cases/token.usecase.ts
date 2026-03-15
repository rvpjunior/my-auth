import { Inject, Injectable } from '@nestjs/common';
import type { AuthorizationCodeRepositoryPort } from '@oauth/application/ports/authorization-code-repository.port';
import { AUTHORIZATION_CODE_REPOSITORY, SIGNER } from '@oauth/tokens';
import type { SignerPort } from '@oauth/application/ports/signer.port';

@Injectable()
export class TokenUseCase {
  constructor(
    @Inject(AUTHORIZATION_CODE_REPOSITORY)
    private readonly authorizationCodeRepository: AuthorizationCodeRepositoryPort,
    @Inject(SIGNER)
    private readonly signer: SignerPort,
  ) {}

  async execute(grantType: string, code: string, redirectUri: string) {
    if (grantType !== 'authorization_code') {
      return {
        error: 'invalid_grant_type',
        error_description: 'Invalid grant type',
      };
    }

    const authorizationCode = this.authorizationCodeRepository.findByCode(code);
    if (!authorizationCode) {
      return {
        error: 'invalid_grant',
        error_description: 'Invalid grant code',
      };
    }

    if (authorizationCode.redirectUri !== redirectUri) {
      return {
        error: 'invalid_grant',
        error_description: 'Invalid redirect URI',
      };
    }

    if (authorizationCode.expiresAt < new Date()) {
      return {
        error: 'invalid_grant',
        error_description: 'Expired grant code',
      };
    }

    await this.authorizationCodeRepository.delete(code);

    const expiresIn = 60 * 5; // 5 minutes
    const issuer = 'http://localhost:3000';
    const accessToken = await this.signer.sign(
      authorizationCode.userId,
      expiresIn,
      issuer,
    );

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
    };
  }
}
