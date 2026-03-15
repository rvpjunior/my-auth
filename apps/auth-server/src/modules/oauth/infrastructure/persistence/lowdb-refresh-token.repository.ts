import { LowdbService } from '@infrastructure/persistence/lowdb/lowdb.service';
import { RefreshToken } from '@oauth/domain/entities/refresh-token.entity';
import { RefreshTokenRepositoryPort } from '@oauth/application/ports/refresh-token-repository.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LowdbRefreshTokenRepository implements RefreshTokenRepositoryPort {
  constructor(private readonly db: LowdbService) {}

  findByToken(token: string): RefreshToken | null {
    const refreshToken = this.db.data.refreshTokens.find(
      (refreshToken) => refreshToken.token === token,
    );
    if (!refreshToken) {
      return null;
    }
    return new RefreshToken(
      refreshToken.token,
      refreshToken.clientId,
      refreshToken.userId,
      refreshToken.expiresAt,
    );
  }

  async create(refreshToken: RefreshToken): Promise<void> {
    this.db.data.refreshTokens.push({
      token: refreshToken.token,
      clientId: refreshToken.clientId,
      userId: refreshToken.userId,
      expiresAt: refreshToken.expiresAt,
    });
    await this.db.write();
  }

  async delete(token: string): Promise<void> {
    this.db.data.refreshTokens = this.db.data.refreshTokens.filter(
      (refreshToken) => refreshToken.token !== token,
    );
    await this.db.write();
  }
}
