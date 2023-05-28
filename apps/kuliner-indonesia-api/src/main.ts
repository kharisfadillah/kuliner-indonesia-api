/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app/app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  const port = process.env.PORT || 3333
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Kuliner Indonesia API')
    .setDescription('API untuk Kuliner Indonesia')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}/`, 'Development')
    .addServer(`http://localhost:5000/`, 'Production')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(port)
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`)
}

bootstrap()
