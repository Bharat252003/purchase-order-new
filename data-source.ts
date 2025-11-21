import 'dotenv/config';
import { DataSource } from 'typeorm';

// Import your entities manually
import { PoMaster } from './src/purchase/entities/po-master.entity';
import { PoDetail } from './src/purchase/entities/po-detail.entity';
import { GrMaster } from './src/purchase/entities/gr-master.entity';
import { GrDetail } from './src/purchase/entities/gr-detail.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || undefined,

  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
  port: process.env.DATABASE_URL ? undefined : Number(process.env.DB_PORT) || 5432,
  username: process.env.DATABASE_URL ? undefined : process.env.DB_USERNAME,
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
  database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,

  entities: [PoMaster, PoDetail, GrMaster, GrDetail],
  migrations: ['dist/src/migrations/*.js'],

  // SSL for Supabase
  extra: process.env.DATABASE_URL
    ? { ssl: { rejectUnauthorized: false } }
    : undefined,
});
