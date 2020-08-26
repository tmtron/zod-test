import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('zod example')
    .setDescription('zod API description')
    .setVersion('1.0')
    .addTag('zod')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const PORT = 3000;
  await app.listen(PORT);
  console.log('started server on port', PORT);
}
bootstrap().catch(e => console.error('bootstrap failed', e));
