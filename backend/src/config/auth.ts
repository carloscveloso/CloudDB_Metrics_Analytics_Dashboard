import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'default-secret-change-me',
  expiresIn: '7d', // Token válido por 7 dias
  refreshExpiresIn: '30d', // Refresh token válido por 30 dias
};

export const BCRYPT_ROUNDS = 10; // Custo do hash bcrypt