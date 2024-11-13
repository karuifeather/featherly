import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

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
