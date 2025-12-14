import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SweetsModule } from './sweets/sweets.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // Configuration module for environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    SweetsModule,
  ],
})
export class AppModule {}


