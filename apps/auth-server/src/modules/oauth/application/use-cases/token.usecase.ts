import { Inject, Injectable } from '@nestjs/common';
import type { AuthorizationCodeRepositoryPort } from '@oauth/application/ports/authorization-code-repository.port';
import {
  AUTHORIZATION_CODE_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
  SIGNER,
} from '@oauth/tokens';
import type { SignerPort } from '@oauth/application/ports/signer.port';
import type { RefreshTokenRepositoryPort } from '@oauth/application/ports/refresh-token-repository.port';
import type {
  AuthorizationCodeTokenRequest,
  RefreshTokenTokenRequest,
  TokenRequest,
} from './token.types';
import { RefreshToken } from '@oauth/domain/entities/refresh-token.entity';

@Injectable()
export class TokenUseCase {
  constructor(
    @Inject(AUTHORIZATION_CODE_REPOSITORY)
    private readonly authorizationCodeRepository: AuthorizationCodeRepositoryPort,
    @Inject(SIGNER)
    private readonly signer: SignerPort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
  ) {}

  private async executeAuthorizationToken(
    request: AuthorizationCodeTokenRequest,
  ): Promise<string> {
    const authorizationCode = this.authorizationCodeRepository.findByCode(
      request.code,
    );
    if (!authorizationCode) {
      throw new Error('invalid_grant');
    }

    if (authorizationCode.clientId !== request.client_id) {
      throw new Error('invalid_request');
    }

    if (authorizationCode.redirectUri !== request.redirect_uri) {
      throw new Error('invalid_request');
    }

    if (authorizationCode.expiresAt < new Date()) {
      throw new Error('invalid_grant');
    }

    await this.authorizationCodeRepository.delete(authorizationCode.code);

    return authorizationCode.userId;
  }

  private async executeRefreshToken(
    request: RefreshTokenTokenRequest,
  ): Promise<string> {
    const refreshToken = this.refreshTokenRepository.findByToken(
      request.refresh_token,
    );
    if (!refreshToken) {
      throw new Error('invalid_request');
    }

    if (refreshToken.clientId !== request.client_id) {
      throw new Error('invalid_grant');
    }

    if (refreshToken.expiresAt < new Date()) {
      throw new Error('invalid_grant');
    }

    await this.refreshTokenRepository.delete(refreshToken.token);

    return refreshToken.userId;
  }

  async execute(request: TokenRequest) {
    let userId: string;

    if (request.grant_type === 'authorization_code') {
      userId = await this.executeAuthorizationToken(request);
    } else if (request.grant_type === 'refresh_token') {
      userId = await this.executeRefreshToken(request);
    } else {
      throw new Error('invalid_request');
    }

    const refreshToken = new RefreshToken(
      crypto.randomUUID(),
      request.client_id,
      userId,
      new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours
    );
    await this.refreshTokenRepository.create(refreshToken);

    const expiresIn = 60 * 5; // 5 minutes
    const issuer = 'http://localhost:4000';
    const accessToken = await this.signer.sign(userId, expiresIn, issuer);

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      refresh_token: refreshToken.token,
    };
  }
}
