import { Inject, Injectable } from '@nestjs/common';
import type { ClientRepositoryPort } from '@oauth/application/ports/client.repository.port';
import type { AuthorizationCodeRepositoryPort } from '@oauth/application/ports/authorization-code.repository.port';
import {
  CLIENT_REPOSITORY,
  AUTHORIZATION_CODE_REPOSITORY,
} from '@oauth/tokens';
import type { AuthorizeResponse } from './authorize.types';
import { AuthorizationCode } from '@oauth/domain/entities/authorization-code.entity';

@Injectable()
export class AuthorizeUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepositoryPort,
    @Inject(AUTHORIZATION_CODE_REPOSITORY)
    private readonly authorizationCodeRepository: AuthorizationCodeRepositoryPort,
  ) {}

  async execute(
    clientId: string,
    redirectUri: string,
    responseType: string,
    userId: string,
  ): Promise<AuthorizeResponse> {
    const client = this.clientRepository.findById(clientId);
    if (!client) {
      return Promise.resolve({ type: 'invalid_client' });
    }
    if (!client.redirectUris.includes(redirectUri)) {
      return Promise.resolve({ type: 'invalid_redirect_uri' });
    }

    if (responseType !== 'code') {
      return Promise.resolve({ type: 'invalid_response_type' });
    }

    const authorizationCode = new AuthorizationCode(
      crypto.randomUUID(),
      clientId,
      redirectUri,
      userId,
      new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
    );

    await this.authorizationCodeRepository.create(authorizationCode);

    return Promise.resolve({
      type: 'redirect_to_client',
      redirectTo: `${redirectUri}?code=${authorizationCode.code}`,
    });
  }
}
