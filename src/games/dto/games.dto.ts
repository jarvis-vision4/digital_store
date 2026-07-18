import { Type } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsNumber, IsEnum, Min, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { GameCategory } from '@prisma/client';

export class PackageItem {
  @IsString()
  packageName: string;

  @IsNumber()
  @Min(0)
  priceMmk: number;

  @IsNumber()
  @IsOptional()
  stockQuantity?: number;

  @IsNumber()
  @IsOptional()
  originalPrice?: number;
}

export class CreateGameDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEnum(GameCategory)
  category: GameCategory;

  @IsString()
  image: string;

  @IsString()
  @IsOptional()
  posterUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  minAmount?: string;

  @IsBoolean()
  @IsOptional()
  popular?: boolean;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageItem)
  @ArrayMinSize(1)
  packages: PackageItem[];
}

export class UpdateGameDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(GameCategory)
  @IsOptional()
  category?: GameCategory;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  posterUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  minAmount?: string;

  @IsBoolean()
  @IsOptional()
  popular?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

export class CreatePackageDto {
  @IsString()
  packageName: string;

  @IsNumber()
  @Min(0)
  priceMmk: number;

  @IsNumber()
  @IsOptional()
  stockQuantity?: number;

  @IsNumber()
  @IsOptional()
  originalPrice?: number;
}

export class UpdatePackageDto {
  @IsString()
  @IsOptional()
  packageName?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  priceMmk?: number;

  @IsNumber()
  @IsOptional()
  stockQuantity?: number;

  @IsNumber()
  @IsOptional()
  originalPrice?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateDigitalProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  priceMmk: number;

  @IsNumber()
  @IsOptional()
  stock?: number;
}


