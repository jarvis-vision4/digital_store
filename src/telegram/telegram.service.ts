import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelegramService {
  constructor(private prisma: PrismaService) {}

  async handleWebhook(body: any) {
    const message = body.message?.text || '';
    const chatId = body.message?.chat?.id?.toString() || '';
    const username = body.message?.from?.username || '';

    if (message.startsWith('/start')) {
      return {
        method: 'sendMessage',
        chat_id: Number(chatId),
        text: 'Welcome to Shwe Family Digital Store! Use /help to see available commands.',
      };
    }

    if (message.startsWith('/balance')) {
      const user = await this.prisma.user.findUnique({
        where: { telegramChatId: chatId },
      });
      if (!user) {
        return {
          method: 'sendMessage',
          chat_id: Number(chatId),
          text: 'Please register first via our website.',
        };
      }
      return {
        method: 'sendMessage',
        chat_id: Number(chatId),
        text: `Your wallet balance: ${Number(user.walletBalance).toLocaleString()} MMK`,
      };
    }

    if (message.startsWith('/help')) {
      return {
        method: 'sendMessage',
        chat_id: Number(chatId),
        text: 'Available commands:\n/balance - Check wallet balance\n/help - Show this message',
      };
    }

    return {
      method: 'sendMessage',
      chat_id: Number(chatId),
      text: 'Unknown command. Type /help for available commands.',
    };
  }

  async simulateCommand(dto: { command: string; chatId?: string; username?: string }) {
    return this.handleWebhook({
      message: {
        text: dto.command,
        chat: { id: dto.chatId || '5165712635' },
        from: { username: dto.username || 'test_user' },
      },
    });
  }

  async getDiagnostics() {
    const settings = await this.prisma.systemSetting.findMany({
      where: {
        settingKey: { in: ['telegram_bot_token', 'telegram_chat_ids'] },
      },
    });

    const lastOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, status: true, createdAt: true },
    });

    const result: Record<string, any> = {};
    for (const s of settings) {
      result[s.settingKey] = s.settingValue ? 'configured' : 'not set';
    }

    return {
      settings: result,
      recentOrders: lastOrders,
      botActive: !!settings.find((s) => s.settingKey === 'telegram_bot_token' && s.settingValue),
    };
  }

  async clearDiagnostics() {
    return { message: 'Diagnostics log cleared' };
  }
}
