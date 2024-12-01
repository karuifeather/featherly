import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { swaggerCss } from './swaggerStyles';

import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable graceful shutdown
  app.enableShutdownHooks();

  // Enable CORS in development
  if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      origin: 'http://localhost:4200',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
  }

  const { default: cookierParser } = await import('cookie-parser');
  app.use(cookierParser());

  // Add security headers with CSP including the nonce
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'script-src': ["'self'", 'api.mapbox.com', 'js.stripe.com'],
          'style-src': ["'self'", 'https:', "'unsafe-inline'"],
          'connect-src': ["'self'", 'api.mapbox.com', 'events.mapbox.com'],
          'img-src': ["'self'", 'data:'],
          'font-src': ["'self'", 'https:', 'data:'],
        },
      },
    })
  );

  // Prevent parameter pollution
  const { default: hpp } = await import('hpp');
  app.use(
    hpp({
      whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price',
      ],
    })
  );

  // Compress responses to improve performance
  const { default: compression } = await import('compression');
  app.use(compression());

  // This will enable the automatic validation of all payloads
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false, // error messages will be not be shown in the response
      whitelist: true, // remove any extra fields that are not in the DTO
      transform: true, // transform the incoming payload to the DTO
    })
  );

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    const logger = new Logger('UnhandledRejection');
    logger.error('Unhandled Promise Rejection! Shutting down...');
    logger.error(reason);

    // Gracefully shutdown the server after rejection
    app.close().then(() => {
      process.exit(1); // Exit with failure status
    });
  });

  // Swagger configuration tailored for Featherly
  const config = new DocumentBuilder()
    .setTitle('Featherly')
    .setDescription('This is Featherly API documentation. ')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Featherly API Documentation',
    customCss: swaggerCss,
    swaggerOptions: {
      deepLinking: true,
      docExpansion: 'none',
      filter: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  return app;
}
