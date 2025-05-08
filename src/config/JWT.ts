// src/config/JWT.ts
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { envs } from './envs';

const JWT_SEED: Secret = envs.SEED;

export class JwtAdapter {
  /**
   * duration puede ser un number (segundos) o un StringValue (p.e. '2h', '15m', etc.)
   */
  static generateToken(
    payload: any,
    duration: number | StringValue = '2h'
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const options: SignOptions = { expiresIn: duration };
        const token = jwt.sign(payload, JWT_SEED, options);
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }

  static validateToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SEED, (err, decoded) => {
        console.log("AYUDAAAAAAAAA");
        console.log(JWT_SEED);
        
        
        if (err || !decoded) return resolve(null);
        resolve(decoded as T);
      });
    });
  }
}
