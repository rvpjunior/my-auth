import { Session } from '@sessions/domain/entities/session.entity';

export interface SessionReaderPort {
  findSessionById(id: string): Session | null;
}
