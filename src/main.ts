import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as YAML from 'js-yaml';

import { AppModule } from './app.module';

const PORT = +process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  await app.listen(PORT, () => console.log('Server started at port', PORT));
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
    const yamlSpec = YAML.dump(document);
    fs.writeFileSync(specsPath, yamlSpec);
  }

  SwaggerModule.setup('doc', app, document);
};
