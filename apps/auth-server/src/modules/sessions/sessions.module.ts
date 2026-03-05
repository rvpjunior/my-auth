import { Module } from '@nestjs/common';
import { LowdbSessionRepository } from '@sessions/infrastructure/persistence/lowdb-session.repository';
import {
  SESSION_READER,
  SESSION_REPOSITORY,
  SESSION_WRITER,
} from '@sessions/tokens';
import { LowdbModule } from '@infrastructure/persistence/lowdb/lowdb.module';
import { SessionService } from '@sessions/application/services/session.service';

@Module({
  imports: [LowdbModule],
  exports: [SESSION_READER, SESSION_WRITER],
  providers: [
    SessionService,
    {
      provide: SESSION_READER,
      useExisting: SessionService,
    },
    {
      provide: SESSION_WRITER,
      useExisting: SessionService,
    },
    {
      provide: SESSION_REPOSITORY,
      useClass: LowdbSessionRepository,
    },
  ],
})
export class SessionsModule {}
