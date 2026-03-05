import { Request } from 'express';

export type AuthRequest = Request & {
  cookies: {
    sid?: string;
  };
};
