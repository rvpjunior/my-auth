import { Injectable } from '@nestjs/common';
import { LowdbService } from '@database/lowdb/lowdb.service';
import { AuthorizationCodeRepositoryPort } from '@oauth/application/ports/authorization-code-repository.port';
import { AuthorizationCode } from '@oauth/domain/entities/authorization-code.entity';

@Injectable()
export class LowdbAuthorizationCodeRepository implements AuthorizationCodeRepositoryPort {
  constructor(private readonly db: LowdbService) {}

  findByCode(code: string): AuthorizationCode | null {
    const authorizationCode = this.db.data.authorizationCodes.find(
      (authorizationCode) => authorizationCode.code === code,
    );
    if (!authorizationCode) {
      return null;
    }
    return new AuthorizationCode(
      authorizationCode.code,
      authorizationCode.clientId,
      authorizationCode.redirectUri,
      authorizationCode.userId,
      authorizationCode.expiresAt,
    );
  }

  async create(authorizationCode: AuthorizationCode): Promise<void> {
    this.db.data.authorizationCodes.push({
      code: authorizationCode.code,
      clientId: authorizationCode.clientId,
      redirectUri: authorizationCode.redirectUri,
      userId: authorizationCode.userId,
      expiresAt: authorizationCode.expiresAt,
    });
    await this.db.write();
  }
}
