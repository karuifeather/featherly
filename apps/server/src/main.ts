import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception! Shutting down...');
  console.log(err.name, err.message);
  console.log(err);

  process.exit(1);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 4500;

  // Enable graceful shutdown
  app.enableShutdownHooks();

  // Enable CORS
  app.enableCors();
  const { default: cookierParser } = await import('cookie-parser');
  app.use(cookierParser());

  // Add security headers
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
          'object-src': ["'none'"],
          'frame-ancestors': ["'self'"],
          upgradeInsecureRequests: [],
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

  await app.listen(port);
}

bootstrap();
