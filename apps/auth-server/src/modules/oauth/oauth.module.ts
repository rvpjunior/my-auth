import { Module } from '@nestjs/common';
import { AuthorizeController } from '@oauth/api/controllers/authorize.controller';
import { AuthorizeUseCase } from '@oauth/application/use-cases/authorize.usecase';
import { LowdbClientRepository } from '@oauth/infrastructure/persistence/lowdb-client.repository';
import { LowdbAuthorizationCodeRepository } from '@oauth/infrastructure/persistence/lowdb-authorization-code.repository';
import {
  AUTHORIZATION_CODE_REPOSITORY,
  CLIENT_REPOSITORY,
} from '@oauth/tokens';
import { DatabaseModule } from '@database/lowdb/database.module';
import { SessionsModule } from '@sessions/sessions.module';

@Module({
  controllers: [AuthorizeController],
  imports: [DatabaseModule, SessionsModule],
  providers: [
    AuthorizeUseCase,
    {
      provide: CLIENT_REPOSITORY,
      useClass: LowdbClientRepository,
    },
    {
      provide: AUTHORIZATION_CODE_REPOSITORY,
      useClass: LowdbAuthorizationCodeRepository,
    },
  ],
})
export class OauthModule {}
