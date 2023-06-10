import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import config from '../../config';
import { HairServiceModule } from '../hair-service/hair-service.module';
import { SheetModule } from '../sheet/sheet.module';
import { ClientModule } from '../client/client.module';
import { ColoristModule } from '../colorist/colorist.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
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
    ClientModule,
    ColoristModule,
    HairServiceModule,
    SheetModule,
  ],
})
export class AppModule {}
