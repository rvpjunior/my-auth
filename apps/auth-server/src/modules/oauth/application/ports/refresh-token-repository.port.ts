import { RefreshToken } from '@oauth/domain/entities/refresh-token.entity';

export interface RefreshTokenRepositoryPort {
  create(refreshToken: RefreshToken): Promise<void>;
  findByToken(token: string): RefreshToken | null;
  delete(token: string): Promise<void>;
}
