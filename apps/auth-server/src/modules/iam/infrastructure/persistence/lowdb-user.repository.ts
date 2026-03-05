import { User } from 'src/modules/iam/domain/entities/user.entity';
import type { UserRepositoryPort } from '@iam/application/ports/user-repository.port';
import { Injectable } from '@nestjs/common';
import { LowdbService } from 'src/infrastructure/persistence/lowdb/lowdb.service';

@Injectable()
export class LowdbUserRepository implements UserRepositoryPort {
  constructor(private readonly db: LowdbService) {}

  findByEmail(email: string): User | null {
    const user = this.db.data.users.find((user) => user.email === email);
    if (!user) {
      return null;
    }
    return new User(user.id, user.email, user.passwordHash);
  }
}
