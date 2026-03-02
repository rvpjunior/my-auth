import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { UserRepositoryPort } from '@iam/application/ports/user.repository.port';
import type { PasswordHasherPort } from '@iam/application/ports/password-hasher.port';
import type { User } from '@iam/domain/entities/user.entity';
import { PASSWORD_HASHER, USER_REPOSITORY } from '@iam/tokens';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  execute(email: string, password: string): User {
    const user = this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = this.passwordHasher.verify(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
