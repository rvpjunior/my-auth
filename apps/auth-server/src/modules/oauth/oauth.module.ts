import { Module } from '@nestjs/common';
import { AuthorizeController } from '@oauth/api/controllers/authorize.controller';
import { AuthorizeUseCase } from '@oauth/application/use-cases/authorize.usecase';
import { LowdbClientRepository } from '@oauth/infrastructure/persistence/lowdb-client.repository';
import { LowdbAuthorizationCodeRepository } from '@oauth/infrastructure/persistence/lowdb-authorization-code.repository';
import {
  AUTHORIZATION_CODE_REPOSITORY,
  CLIENT_REPOSITORY,
  SIGNER,
} from '@oauth/tokens';
import { LowdbModule } from '@infrastructure/persistence/lowdb/lowdb.module';
import { SessionsModule } from '@sessions/sessions.module';
import { JoseSigner } from './infrastructure/crypto/jose-signer';
import { TokenController } from './api/controllers/token.controller';
import { TokenUseCase } from './application/use-cases/token.usecase';

@Module({
  controllers: [AuthorizeController, TokenController],
  imports: [LowdbModule, SessionsModule],
  providers: [
    AuthorizeUseCase,
    TokenUseCase,
    {
      provide: CLIENT_REPOSITORY,
      useClass: LowdbClientRepository,
    },
    {
      provide: AUTHORIZATION_CODE_REPOSITORY,
      useClass: LowdbAuthorizationCodeRepository,
    },
    {
      provide: SIGNER,
      useClass: JoseSigner,
    },
  ],
})
export class OauthModule {}
