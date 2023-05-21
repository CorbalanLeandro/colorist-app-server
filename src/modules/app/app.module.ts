import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import config from '../../config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('db.uri'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
  ],
})
export class AppModule {}
