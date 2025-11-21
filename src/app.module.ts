import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PurchaseModule } from './purchase/purchase.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [PurchaseModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || undefined,
      host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST || 'localhost',
      port: process.env.DATABASE_URL ? undefined : Number(process.env.DB_PORT) || 5432,
      username: process.env.DATABASE_URL ? undefined : process.env.DB_USERNAME || 'postgres',
      password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD || 'postgres',
      database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME || 'purchase_order_db',
      autoLoadEntities: true,
      synchronize: false,
      // For managed Postgres providers like Supabase, pass SSL options under `extra.ssl`
      // so the underlying `pg` driver receives them correctly.
      extra: process.env.DATABASE_URL
        ? { ssl: { rejectUnauthorized: false } }
        : undefined,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
