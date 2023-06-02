import dotenv from 'dotenv';

dotenv.config();

export const PORT: number = parseInt(process.env.PORT || '3000', 10);

export const DB_HOST: string | undefined = process.env.DB_HOST;
export const DB_USER: string | undefined = process.env.DB_USER;
export const DB_PASSWORD: string | undefined = process.env.DB_PASSWORD;
export const DB_DATABASE: string | undefined = process.env.DB_DATABASE;