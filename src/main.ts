import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { stringify } from 'yaml';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 4000;

  const mode = process.env.NODE_ENV;

  if (mode === 'development') {
    setupSwagger(app);
  }

  await app.listen(port, () => {
    console.log('Server started at port', port);
  });
}

bootstrap();

export const setupSwagger = (app) => {
  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const specsPath = 'doc/api-spec.yaml';

  if (!fs.existsSync(specsPath)) {
    const yamlSpec = stringify(document);
    fs.writeFileSync(specsPath, yamlSpec);
  }

  SwaggerModule.setup('doc', app, document);
};
