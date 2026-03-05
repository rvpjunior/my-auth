import { LowdbService } from 'src/infrastructure/persistence/lowdb/lowdb.service';
import { SessionRepositoryPort } from '@sessions/application/ports/session-repository.port';
import { Session } from '@sessions/domain/entities/session.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LowdbSessionRepository implements SessionRepositoryPort {
  constructor(private readonly db: LowdbService) {}

  async create(session: Session): Promise<Session> {
    this.db.data.sessions.push({
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
    });
    await this.db.write();
    return session;
  }

  findById(id: string): Session | null {
    const session = this.db.data.sessions.find((session) => session.id === id);
    if (!session) {
      return null;
    }
    return new Session(session.id, session.userId, session.expiresAt);
  }

  async delete(id: string): Promise<void> {
    this.db.data.sessions = this.db.data.sessions.filter(
      (session) => session.id !== id,
    );
    await this.db.write();
  }
}
