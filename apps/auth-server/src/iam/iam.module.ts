import { Module } from '@nestjs/common';
import { LoginController } from '@iam/api/controllers/login.controller';
import { PasswordHasher } from '@iam/infrastructure/crypto/password-hasher';
import { PASSWORD_HASHER, USER_REPOSITORY } from '@iam/tokens';
import { UserRepository } from '@iam/infrastructure/persistence/user.repository';
import { LoginUseCase } from '@iam/application/use-cases/login.usecase';

@Module({
  controllers: [LoginController],
  providers: [
    LoginUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: PasswordHasher,
    },
  ],
})
export class IamModule {}
