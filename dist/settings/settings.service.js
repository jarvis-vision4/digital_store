"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SettingsService = class SettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSetting(key) {
        const setting = await this.prisma.systemSetting.findUnique({
            where: { settingKey: key },
        });
        return setting?.settingValue ?? null;
    }
    async setSetting(key, value) {
        await this.prisma.systemSetting.upsert({
            where: { settingKey: key },
            update: { settingValue: value },
            create: { settingKey: key, settingValue: value },
        });
    }
    async getActiveBanners() {
        return this.prisma.promotionalBanner.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getGlobalNotice() {
        const notice = await this.getSetting('global_notice');
        return { notice: notice || '' };
    }
    async getSupportContacts() {
        const contacts = await this.getSetting('support_contacts');
        return contacts ? JSON.parse(contacts) : {};
    }
    async getPaymentSettings() {
        const data = await this.getSetting('payment_settings');
        return data ? JSON.parse(data) : {};
    }
    async index() {
        const settings = await this.prisma.systemSetting.findMany();
        const result = {};
        for (const s of settings) {
            result[s.settingKey] = s.settingValue;
        }
        return result;
    }
    async updatePaymentSettings(dto) {
        const current = await this.getSetting('payment_settings');
        const currentObj = current ? JSON.parse(current) : {};
        const updated = { ...currentObj, ...dto };
        await this.setSetting('payment_settings', JSON.stringify(updated));
        return { message: 'Payment settings updated' };
    }
    async updateSecuritySettings(dto) {
        if (dto.exchangeRateThaiBaht) {
            await this.setSetting('exchange_rate_thai_baht', dto.exchangeRateThaiBaht);
        }
        return { message: 'Security settings updated' };
    }
    async updateNotice(dto) {
        await this.setSetting('global_notice', dto.globalNotice);
        return { message: 'Notice updated' };
    }
    async updateTelegramBot(dto) {
        if (dto.botToken) {
            await this.setSetting('telegram_bot_token', dto.botToken);
        }
        if (dto.chatIds) {
            await this.setSetting('telegram_chat_ids', dto.chatIds);
        }
        return { message: 'Telegram bot settings updated' };
    }
    async getBannersAdmin() {
        return this.prisma.promotionalBanner.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async storeBanner(dto) {
        return this.prisma.promotionalBanner.create({ data: dto });
    }
    async updateBanner(id, dto) {
        const banner = await this.prisma.promotionalBanner.findUnique({
            where: { id },
        });
        if (!banner)
            throw new common_1.NotFoundException('Banner not found');
        return this.prisma.promotionalBanner.update({
            where: { id },
            data: dto,
        });
    }
    async getAdminStats() {
        const [totalUsers, totalOrders, totalRevenue, pendingOrders, pendingTopups] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.order.count(),
            this.prisma.order.aggregate({
                _sum: { amountMmk: true },
                where: { status: 'Success' },
            }),
            this.prisma.order.count({ where: { status: 'Pending' } }),
            this.prisma.walletTransaction.count({
                where: { type: 'DEPOSIT', status: 'Pending' },
            }),
        ]);
        return {
            totalUsers,
            totalOrders,
            totalRevenue: totalRevenue._sum.amountMmk || 0,
            pendingOrders,
            pendingTopups,
        };
    }
    async getAuditLogs() {
        return this.prisma.auditLog.findMany({
            include: {
                user: { select: { username: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map