import { registerAs } from '@nestjs/config';

export interface IMongoConfig {
  connectionUrl: string;
  dbName: string;
}

const MongoConfig = registerAs(
  'mongoConfig',
  (): IMongoConfig => ({
    connectionUrl: process.env.MONGO_DB_URL,
    dbName: 'soldcom',
  }),
);

export default MongoConfig;
