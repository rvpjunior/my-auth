import { User } from '@iam/domain/entities/user.entity';
import type { UserRepositoryPort } from '@iam/application/ports/user.repository.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  findByEmail(email: string): User | null {
    if (email === 'test@test.com') {
      return new User('1', 'test@test.com', 'test');
    }

    return null;
  }
}
