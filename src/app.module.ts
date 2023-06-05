import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import AppConfig, { IAppConfig } from 'config/app.config';
import MongoConfig, { IMongoConfig } from 'config/mongo.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig, MongoConfig],
      envFilePath: ['.env'],
      expandVariables: true,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<
          {
            appConfig: IAppConfig;
            mongoConfig: IMongoConfig;
          },
          true
        >,
      ) => {
        const mongoConfig = configService.get('mongoConfig', { infer: true });
        return {
          uri: mongoConfig.connectionUrl,
        };
      },
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
