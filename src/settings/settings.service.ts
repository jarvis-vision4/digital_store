import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePaymentSettingsDto, UpdateSecuritySettingsDto, UpdateNoticeDto, UpdateTelegramBotDto, CreateBannerDto, UpdateBannerDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  private async getSetting(key: string): Promise<string | null> {
    const setting = await this.prisma.systemSetting.findUnique({
      where: { settingKey: key },
    });
    return setting?.settingValue ?? null;
  }

  private async setSetting(key: string, value: string) {
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
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.settingKey] = s.settingValue;
    }
    return result;
  }

  async updatePaymentSettings(dto: UpdatePaymentSettingsDto) {
    const current = await this.getSetting('payment_settings');
    const currentObj = current ? JSON.parse(current) : {};
    const updated = { ...currentObj, ...dto };
    await this.setSetting('payment_settings', JSON.stringify(updated));
    return { message: 'Payment settings updated' };
  }

  async updateSecuritySettings(dto: UpdateSecuritySettingsDto) {
    if (dto.exchangeRateThaiBaht) {
      await this.setSetting('exchange_rate_thai_baht', dto.exchangeRateThaiBaht);
    }
    return { message: 'Security settings updated' };
  }

  async updateNotice(dto: UpdateNoticeDto) {
    await this.setSetting('global_notice', dto.globalNotice);
    return { message: 'Notice updated' };
  }

  async updateTelegramBot(dto: UpdateTelegramBotDto) {
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

  async storeBanner(dto: CreateBannerDto) {
    return this.prisma.promotionalBanner.create({ data: dto });
  }

  async updateBanner(id: string, dto: UpdateBannerDto) {
    const banner = await this.prisma.promotionalBanner.findUnique({
      where: { id },
    });
    if (!banner) throw new NotFoundException('Banner not found');
    return this.prisma.promotionalBanner.update({
      where: { id },
      data: dto,
    });
  }

  async getAdminStats() {
    const [totalUsers, totalOrders, totalRevenue, pendingOrders, pendingTopups] =
      await Promise.all([
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
}
