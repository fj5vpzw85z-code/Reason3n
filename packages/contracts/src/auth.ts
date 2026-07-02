import { z } from 'zod';

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const TokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number()
});

export type TokenResponse = z.infer<typeof TokenResponseSchema>;

export const JwtPayloadSchema = z.object({
  sub: z.string().uuid(),          // User ID
  workspaceId: z.string().uuid(), // Current Workspace ID
  role: z.enum(['viewer', 'editor', 'admin', 'owner']),
  jti: z.string().uuid(),         // JWT ID for revocation
  exp: z.number(),
  iss: z.string(),
  aud: z.string()
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
