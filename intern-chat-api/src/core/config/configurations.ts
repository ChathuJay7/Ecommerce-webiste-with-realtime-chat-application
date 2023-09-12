import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConnection = process.env.MONGO_CONNECTION;