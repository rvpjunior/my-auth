import { User } from '@iam/domain/entities/user.entity';

export interface UserRepositoryPort {
  findByEmail(email: string): User | null;
}
