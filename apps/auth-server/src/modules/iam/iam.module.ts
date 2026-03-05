import { Module } from '@nestjs/common';
import { LoginController } from '@iam/api/controllers/login.controller';
import { PasswordHasher } from '@iam/infrastructure/crypto/password-hasher';
import { PASSWORD_HASHER, USER_REPOSITORY } from '@iam/tokens';
import { LowdbUserRepository } from '@iam/infrastructure/persistence/lowdb-user.repository';
import { LoginUseCase } from '@iam/application/use-cases/login.usecase';
import { LowdbModule } from '@infrastructure/persistence/lowdb/lowdb.module';
import { LogoutController } from '@iam/api/controllers/logout.controller';
import { SessionsModule } from '@sessions/sessions.module';

@Module({
  controllers: [LoginController, LogoutController],
  imports: [LowdbModule, SessionsModule],
  providers: [
    LoginUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: LowdbUserRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: PasswordHasher,
    },
  ],
})
export class IamModule {}
