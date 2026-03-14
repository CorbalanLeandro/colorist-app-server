import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  imports: [TerminusModule, MongooseModule],
})
export class HealthModule {}
