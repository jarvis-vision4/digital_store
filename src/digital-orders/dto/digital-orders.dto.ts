import { IsString, IsNumber, Min } from 'class-validator';

export class CreateDigitalOrderDto {
  @IsString()
  digitalProductId: string;

  @IsString()
  productName: string;

  @IsNumber()
  @Min(0)
  amountMmk: number;
}

