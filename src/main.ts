import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IAppConfig } from 'config/app.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>('appConfig', { infer: true });
  const swaggerPath = appConfig.apiDocsPath;
  const port = appConfig.port;

  /**
   * Public Swagger Docs for Pre-ping
   */
  const config = new DocumentBuilder()
    .setTitle('Sold.com | BE Test Docs')
    .setDescription('Swagger API documentation for our BE test docs')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerPath, app, document, {
    swaggerOptions: {
      docExpansion: 'list',
    },
  });

  await app.listen(port);
  Logger.log(`Application started on port ${port}`);
}
bootstrap();
