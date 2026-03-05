import { Module } from '@nestjs/common';
import { SessionService } from '@sessions/application/services/session.service';
import { LowdbSessionRepository } from '@sessions/infrastructure/persistence/lowdb-session.repository';
import { SESSION_REPOSITORY } from '@sessions/tokens';
import { DatabaseModule } from '@database/lowdb/database.module';

@Module({
  imports: [DatabaseModule],
  exports: [SessionService],
  providers: [
    SessionService,
    {
      provide: SESSION_REPOSITORY,
      useClass: LowdbSessionRepository,
    },
  ],
})
export class SessionsModule {}
