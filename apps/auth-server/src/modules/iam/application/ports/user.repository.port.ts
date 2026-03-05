import { User } from 'src/modules/iam/domain/entities/user.entity';

export interface UserRepositoryPort {
  findByEmail(email: string): User | null;
}
