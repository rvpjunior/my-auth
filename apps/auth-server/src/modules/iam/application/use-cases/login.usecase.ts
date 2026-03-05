import { Inject, Injectable } from '@nestjs/common';
import type { UserRepositoryPort } from 'src/modules/iam/application/ports/user.repository.port';
import type { PasswordHasherPort } from 'src/modules/iam/application/ports/password-hasher.port';
import type { User } from 'src/modules/iam/domain/entities/user.entity';
import { PASSWORD_HASHER, USER_REPOSITORY } from 'src/modules/iam/iam.tokens';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  execute(email: string, password: string): User | null {
    const user = this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = this.passwordHasher.verify(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
