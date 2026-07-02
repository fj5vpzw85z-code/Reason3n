import { Request, Response } from 'express';
import { LoginRequestSchema, TokenResponse } from '@reason3n/contracts';
import { HashingService } from '../../shared/crypto/hashing';
import { JwtService } from '../../shared/crypto/jwt';
import { pool } from '../../shared/db/db';

const MOCK_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'admin@reason3n.com',
  workspaceId: '11111111-1111-1111-1111-111111111111',
  role: 'owner' as const,
  passwordHash: '$argon2id$v=19$m=65536,t=3,p=1$Ei8OLDEYt7BZWdvbl7FDpQ$t1LAeI/uHe/0zV211HrO/o3sNR0qPNKvpfy7X5PIoG0'
};

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const body = LoginRequestSchema.parse(req.body);

      let user;
      try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [body.email]);
        if (result.rows.length === 0) throw new Error('Not found in DB');
        user = result.rows[0];
      } catch (dbErr) {
        console.warn('⚠️ DB not connected or user not found, falling back to mock user for local MVP.');
        if (body.email !== MOCK_USER.email) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        user = {
          id: MOCK_USER.id,
          workspace_id: MOCK_USER.workspaceId,
          role: MOCK_USER.role,
          password_hash: MOCK_USER.passwordHash
        };
      }

      const isValid = await HashingService.verifyPassword(user.password_hash, body.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const tokens = JwtService.generateTokens(user.id, user.workspace_id, user.role);

      const response: TokenResponse = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 900 // 15 min
      };

      return res.json(response);
    } catch (err) {
      console.error('Login error:', err);
      return res.status(400).json({ error: 'Invalid request payload' });
    }
  }

  static async refresh(req: Request, res: Response) {
    return res.status(501).json({ error: 'Not implemented yet' });
  }
}
