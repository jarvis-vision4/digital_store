import { IsString, IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';

export class CreateDigitalProductDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @Min(0)
  priceMmk!: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
