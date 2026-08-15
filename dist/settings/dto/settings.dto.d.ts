export declare class UpdatePaymentSettingsDto {
    accountName?: string;
    kbzPayNumber?: string;
    wavePayNumber?: string;
    ayaPayNumber?: string;
    uabPayNumber?: string;
    thaiBankDetails?: string;
}
export declare class UpdateSecuritySettingsDto {
    exchangeRateThaiBaht?: string;
}
export declare class UpdateNoticeDto {
    globalNotice: string;
}
export declare class UpdateSupportContactsDto {
    phone?: string;
    viber?: string;
    telegram?: string;
    tiktok?: string;
    facebook?: string;
}
export declare class UpdateTelegramBotDto {
    botToken?: string;
    chatIds?: string;
}
export declare class CreateBannerDto {
    id: string;
    title: string;
    imageUrl?: string;
    description?: string;
    badge?: string;
    isActive?: boolean;
}
export declare class UpdateBannerDto {
    title?: string;
    imageUrl?: string;
    description?: string;
    badge?: string;
    isActive?: boolean;
}
