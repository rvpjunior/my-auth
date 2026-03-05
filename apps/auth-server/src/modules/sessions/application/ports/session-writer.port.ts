import { Session } from '@sessions/domain/entities/session.entity';

export interface SessionWriterPort {
  createSession(userId: string): Promise<Session>;
  deleteSession(id: string): Promise<void>;
}
