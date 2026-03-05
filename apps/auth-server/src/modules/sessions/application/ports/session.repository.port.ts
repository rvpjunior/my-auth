import type { Session } from '@sessions/domain/entities/session.entity';

export interface SessionRepositoryPort {
  create(session: Session): Promise<Session>;
  findById(id: string): Session | null;
  delete(id: string): Promise<void>;
}
