import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoURI = configService.get('mongoURI') || process.env.MONGO_URI;

        if (!mongoURI) {
          throw new Error('Mongo URI is not defined.');
        }

        const logger = new Logger('MongoDB');

        return {
          uri: mongoURI,
          dbName:
            configService.get('NODE_ENV') === 'development' ? 'test' : 'prod',
          onConnectionCreate: (connection) => {
            connection.on('connected', () => {
              logger.log(
                `Successfully connected to the database: ${connection.name}!!`
              );
            });

            connection.on('error', (err) => {
              logger.error('Database connection error:', err);
            });

            connection.on('disconnected', () => {
              logger.warn('Disconnected from the database.');
            });
          },
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60 * 60,
        limit: 100,
      },
    ]),
  ],
})
export class AppModule {}
