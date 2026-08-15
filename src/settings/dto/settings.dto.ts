import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdatePaymentSettingsDto {
  @IsString()
  @IsOptional()
  accountName?: string;

  @IsString()
  @IsOptional()
  kbzPayNumber?: string;

  @IsString()
  @IsOptional()
  wavePayNumber?: string;

  @IsString()
  @IsOptional()
  ayaPayNumber?: string;

  @IsString()
  @IsOptional()
  uabPayNumber?: string;

  @IsString()
  @IsOptional()
  thaiBankDetails?: string;
}

export class UpdateSecuritySettingsDto {
  @IsString()
  @IsOptional()
  exchangeRateThaiBaht?: string;
}

export class UpdateNoticeDto {
  @IsString()
  globalNotice: string;
}

export class UpdateSupportContactsDto {
  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  viber?: string;

  @IsString()
  @IsOptional()
  telegram?: string;

  @IsString()
  @IsOptional()
  tiktok?: string;

  @IsString()
  @IsOptional()
  facebook?: string;
}

export class UpdateTelegramBotDto {
  @IsString()
  @IsOptional()
  botToken?: string;

  @IsString()
  @IsOptional()
  chatIds?: string;
}

export class CreateBannerDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  badge?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateBannerDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  badge?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
