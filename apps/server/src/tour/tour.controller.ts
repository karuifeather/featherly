import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TourService } from './tour.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('tours')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Get('tour-stats')
  getTourStats() {
    return this.tourService.getTourStats();
  }

  @Get('top-5-cheap')
  aliasTopTours(@Query() query) {
    query.sort = '-price';
    query.limit = 5;
    return this.tourService.getAllTours(query);
  }

  @Get('monthly-plan/:year')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'lead-guide', 'guide')
  getMonthlyPlan(@Param('year') year: number) {
    return this.tourService.getMonthlyPlan(year);
  }

  @Get('tours-within/:distance/center/:latlng/unit/:unit')
  getToursWithin(
    @Param('distance') distance: number,
    @Param('latlng') latlng: string,
    @Param('unit') unit: string
  ) {
    return this.tourService.getToursWithin(distance, latlng, unit);
  }

  @Get('distances/:latlng/unit/:unit')
  getDistances(@Param('latlng') latlng: string, @Param('unit') unit: string) {
    return this.tourService.getDistances(latlng, unit);
  }

  @Get()
  getAllTours(@Query() query) {
    return this.tourService.getAllTours(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'lead-guide')
  createTour(@Body() body) {
    return this.tourService.createTour(body);
  }

  @Get(':id')
  getTour(@Param('id') id: string) {
    return this.tourService.getTour(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'lead-guide')
  updateTour(@Param('id') id: string, @Body() body) {
    return this.tourService.updateTour(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'lead-guide')
  deleteTour(@Param('id') id: string) {
    return this.tourService.deleteTour(id);
  }
}
