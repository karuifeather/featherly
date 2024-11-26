import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryDto } from '../../shared/query.dto';

export class QueryToursDto extends BaseQueryDto {
  @ApiPropertyOptional({
    description: 'Filter tours by difficulty (e.g., "easy").',
    example: 'easy',
  })
  difficulty?: string;

  @ApiPropertyOptional({
    description: 'Filter tours by price range (e.g., "price[gte]=500").',
    example: { price: { gte: 500 } },
  })
  filters?: Record<string, string | number>;
}
