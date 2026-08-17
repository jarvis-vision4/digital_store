import { IsString, IsOptional, IsBoolean, IsNumber, Min, IsArray, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

function ParseJsonArray() {
  return Transform(({ value }) => {
    if (value === undefined || value === null || Array.isArray(value)) return value;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  });
}

export class CreateVariantDto {
  @ApiProperty({ example: '1 Month Pro' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @Min(1)
  durationDays!: number;

  @ApiProperty({ example: 8500 })
  @IsNumber()
  @Min(0)
  priceMmk!: number;

  @ApiPropertyOptional({ example: 1.5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceUsd?: number;

  @ApiPropertyOptional({ example: 'HOT' })
  @IsString()
  @IsOptional()
  badge?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateFeatureDto {
  @ApiProperty({ example: 'All Pro Filters & Effects' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

export class CreateDigitalProductDto {
  @ApiProperty({ example: 'CapCut Pro' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'Video Editing' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 8500, description: 'Base price or price when no variants' })
  @IsNumber()
  @Min(0)
  priceMmk!: number;

  @ApiPropertyOptional({ example: 4.9 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ example: 'HOT' })
  @IsString()
  @IsOptional()
  badge?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional({ type: [CreateVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  @ParseJsonArray()
  @IsOptional()
  variants?: CreateVariantDto[];

  @ApiPropertyOptional({ type: [CreateFeatureDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFeatureDto)
  @ParseJsonArray()
  @IsOptional()
  features?: CreateFeatureDto[];
}
