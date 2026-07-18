import { SettingsService } from './settings.service';
import { UpdatePaymentSettingsDto, UpdateSecuritySettingsDto, UpdateNoticeDto, UpdateTelegramBotDto, CreateBannerDto, UpdateBannerDto } from './dto/settings.dto';
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
    getActiveBanners(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        imageUrl: string;
        badge: string | null;
    }[]>;
    getGlobalNotice(): Promise<{
        notice: string;
    }>;
    getSupportContacts(): Promise<any>;
    getPaymentSettings(): Promise<any>;
    index(): Promise<Record<string, string>>;
    updatePaymentSettings(dto: UpdatePaymentSettingsDto): Promise<{
        message: string;
    }>;
    updateSecuritySettings(dto: UpdateSecuritySettingsDto): Promise<{
        message: string;
    }>;
    updateNotice(dto: UpdateNoticeDto): Promise<{
        message: string;
    }>;
    updateTelegramBot(dto: UpdateTelegramBotDto): Promise<{
        message: string;
    }>;
    getBannersAdmin(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        imageUrl: string;
        badge: string | null;
    }[]>;
    storeBanner(dto: CreateBannerDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        imageUrl: string;
        badge: string | null;
    }>;
    updateBanner(id: string, dto: UpdateBannerDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        imageUrl: string;
        badge: string | null;
    }>;
    getAdminStats(): Promise<{
        totalUsers: number;
        totalOrders: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        pendingOrders: number;
        pendingTopups: number;
    }>;
    getAuditLogs(): Promise<({
        user: {
            username: string;
        };
    } & {
        id: bigint;
        createdAt: Date;
        userId: bigint;
        action: string;
        ipAddress: string | null;
        userAgent: string | null;
    })[]>;
}
