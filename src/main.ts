import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Swagger API')
    .setDescription('The example API description')
    .setVersion('1.0')
    .addServer('/api', 'UAT')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      displayOperationId: true,
    },
  });

  app.setGlobalPrefix('api'),
    app.useGlobalPipes(new ValidationPipe()),
    await app.listen(3000);
}
bootstrap();
