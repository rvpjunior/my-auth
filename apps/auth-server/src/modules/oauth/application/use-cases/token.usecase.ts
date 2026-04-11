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
  ExecuteTokenExchangeResponse,
  RefreshTokenTokenRequest,
  TokenRequest,
} from './token.types';
import { RefreshToken } from '@oauth/domain/entities/refresh-token.entity';
import { USER_REPOSITORY } from '@oauth/tokens';
import type { UserRepositoryPort } from '@oauth/application/ports/user-repository.port';

@Injectable()
export class TokenUseCase {
  constructor(
    @Inject(AUTHORIZATION_CODE_REPOSITORY)
    private readonly authorizationCodeRepository: AuthorizationCodeRepositoryPort,
    @Inject(SIGNER)
    private readonly signer: SignerPort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  private async executeAuthorizationToken(
    request: AuthorizationCodeTokenRequest,
  ): Promise<ExecuteTokenExchangeResponse> {
    const authorizationCode = this.authorizationCodeRepository.findByCode(
      request.code,
    );
    if (!authorizationCode) {
      throw new Error('Invalid authorization code');
    }

    if (authorizationCode.clientId !== request.client_id) {
      throw new Error('Invalid client ID');
    }

    if (authorizationCode.redirectUri !== request.redirect_uri) {
      throw new Error('Invalid redirect URI');
    }

    if (authorizationCode.expiresAt < new Date()) {
      throw new Error('Authorization code expired');
    }

    await this.authorizationCodeRepository.delete(authorizationCode.code);

    return {
      userId: authorizationCode.userId,
      scope: authorizationCode.scope,
    };
  }

  private async executeRefreshToken(
    request: RefreshTokenTokenRequest,
  ): Promise<ExecuteTokenExchangeResponse> {
    const refreshToken = this.refreshTokenRepository.findByToken(
      request.refresh_token,
    );
    if (!refreshToken) {
      throw new Error('Invalid refresh token');
    }

    if (refreshToken.clientId !== request.client_id) {
      throw new Error('Invalid client ID');
    }

    if (refreshToken.expiresAt < new Date()) {
      throw new Error('Refresh token expired');
    }

    await this.refreshTokenRepository.delete(refreshToken.token);

    return {
      userId: refreshToken.userId,
      scope: refreshToken.scope,
    };
  }

  async execute(request: TokenRequest) {
    let result: ExecuteTokenExchangeResponse;

    if (request.grant_type === 'authorization_code') {
      result = await this.executeAuthorizationToken(request);
    } else if (request.grant_type === 'refresh_token') {
      result = await this.executeRefreshToken(request);
    } else {
      throw new Error('Invalid grant type');
    }

    const refreshToken = new RefreshToken(
      crypto.randomUUID(),
      request.client_id,
      result.userId,
      new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours
      result.scope,
    );
    await this.refreshTokenRepository.create(refreshToken);

    const expiresIn = 60 * 5; // 5 minutes
    const issuer = 'http://localhost:4000';
    const accessToken = await this.signer.sign(
      result.userId,
      expiresIn,
      issuer,
    );

    if (result.scope?.includes('openid')) {
      let name: string | undefined = undefined;
      if (result.scope?.includes('profile')) {
        const user = this.userRepository.findById(result.userId);
        if (user) {
          name = user.name;
        }
      }
      const idToken = await this.signer.sign(
        result.userId,
        expiresIn,
        issuer,
        name,
      );
      return {
        access_token: accessToken,
        id_token: idToken,
        token_type: 'Bearer',
        expires_in: expiresIn,
        refresh_token: refreshToken.token,
      };
    }

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      refresh_token: refreshToken.token,
    };
  }
}
