import { IsString, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDigitalOrderDto {
  @ApiProperty({ description: 'Digital product ID' })
  @IsString()
  digitalProductId: string;

  @ApiPropertyOptional({ description: 'Variant ID for subscription plans' })
  @IsString()
  @IsOptional()
  digitalProductVariantId?: string;

  @ApiProperty({ example: 'CapCut Pro - 1 Month' })
  @IsString()
  productName: string;

  @ApiPropertyOptional({ example: '1 Month Pro' })
  @IsString()
  @IsOptional()
  variantName?: string;

  @ApiProperty({ example: 8500 })
  @IsNumber()
  @Min(0)
  amountMmk: number;
}
