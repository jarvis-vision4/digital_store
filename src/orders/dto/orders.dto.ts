import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  gameId: string;

  @IsString()
  gameName: string;

  @IsString()
  packageName: string;

  @IsNumber()
  @Min(0)
  amountMmk: number;

  @IsString()
  @IsOptional()
  playerId?: string;

  @IsString()
  @IsOptional()
  zoneId?: string;
}

export class RateOrderDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  reviewText?: string;
}
