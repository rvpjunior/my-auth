import { AuthorizationCode } from '@oauth/domain/entities/authorization-code.entity';

export interface AuthorizationCodeRepositoryPort {
  findByCode(code: string): AuthorizationCode | null;
  create(authorizationCode: AuthorizationCode): Promise<void>;
}
