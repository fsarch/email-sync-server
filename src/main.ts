import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('Email-Sync-Server')
    .setDescription(
      'A server for sending and receiving email using imap and smtp',
    )
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
