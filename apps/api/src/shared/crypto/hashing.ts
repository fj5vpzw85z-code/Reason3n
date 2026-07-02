import * as argon2 from 'argon2';

export class HashingService {
  /**
   * Hashes a password using Argon2id
   * Conforms to the architecture spec: memory >= 64MB, iterations >= 3
   */
  static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64MB in KB
      timeCost: 3,       // iterations
      parallelism: 1
    });
  }

  /**
   * Verifies a password against a hash
   */
  static async verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
