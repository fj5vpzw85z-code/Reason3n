import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { JwtPayload } from '@reason3n/contracts';

// [PLAATSVOORHOUDER: ANTIGRAVITY_SECRETS_KMS]
// In production, this should be fetched securely.
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';
const ISSUER = 'reason3n-auth';
const AUDIENCE = 'reason3n-api';

export class JwtService {
  /**
   * Generates a short-lived access token (15 mins) and an opaque refresh token
   */
  static generateTokens(userId: string, workspaceId: string, role: string) {
    const jti = randomUUID();
    const accessToken = jwt.sign(
      { sub: userId, workspaceId, role, jti },
      JWT_SECRET,
      { expiresIn: '15m', issuer: ISSUER, audience: AUDIENCE }
    );
    
    // Refresh token should be opaque and stored in the database.
    const refreshToken = randomUUID();

    return { accessToken, refreshToken, jti };
  }

  /**
   * Verifies and decodes the JWT
   */
  static verifyToken(token: string): JwtPayload {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: ISSUER,
      audience: AUDIENCE
    });
    return decoded as JwtPayload;
  }
}
