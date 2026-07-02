import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../crypto/jwt';
import { JwtPayload } from '@reason3n/contracts';

// Augment Express Request
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = JwtService.verifyToken(token);
    req.user = payload;
    // Context for DB Row Level Security can be set here if passing down to data layer
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}
