import { User } from '@oauth/domain/entities/user.entity';

export interface UserRepositoryPort {
  findById(id: string): User | null;
}
