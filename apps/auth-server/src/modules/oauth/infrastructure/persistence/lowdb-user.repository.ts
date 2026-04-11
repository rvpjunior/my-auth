import { User } from '@oauth/domain/entities/user.entity';
import type { UserRepositoryPort } from '@oauth/application/ports/user-repository.port';
import { Injectable } from '@nestjs/common';
import { LowdbService } from 'src/infrastructure/persistence/lowdb/lowdb.service';

@Injectable()
export class LowdbUserRepository implements UserRepositoryPort {
  constructor(private readonly db: LowdbService) {}

  findById(id: string): User | null {
    const user = this.db.data.users.find((user) => user.id === id);
    if (!user) {
      return null;
    }
    return new User(user.id, user.name);
  }
}
