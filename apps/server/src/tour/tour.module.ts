import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TourController } from './tour.controller';
import { TourService } from './tour.service';
import { Tour, TourSchema } from './schemas/tour.schema';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
    AuthModule,
  ],
  controllers: [TourController],
  providers: [TourService],
  exports: [TourService],
})
export class TourModule {}
