import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class SubmitDepositDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  paymentMethod: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  screenshotUrl?: string;
}

export class RedeemCouponDto {
  @IsString()
  code: string;
}

export class GenerateCouponDto {
  @IsString()
  code: string;

  @IsNumber()
  @Min(0)
  amount: number;
}
