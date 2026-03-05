import type { SessionRepositoryPort } from '../ports/session-repository.port';
import { Session } from '@sessions/domain/entities/session.entity';
import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { SESSION_REPOSITORY } from '@sessions/tokens';
import { SessionReaderPort } from '../ports/session-reader.port';
import { SessionWriterPort } from '../ports/session-writer.port';

@Injectable()
export class SessionService implements SessionReaderPort, SessionWriterPort {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepositoryPort,
  ) {}

  async createSession(userId: string): Promise<Session> {
    const session = new Session(
      randomUUID(),
      userId,
      new Date(Date.now() + 1000 * 60 * 60 * 24),
    );
    return this.sessionRepository.create(session);
  }

  findSessionById(id: string): Session | null {
    return this.sessionRepository.findById(id);
  }

  async deleteSession(id: string): Promise<void> {
    return this.sessionRepository.delete(id);
  }
}
