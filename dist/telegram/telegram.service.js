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
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TelegramService = class TelegramService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleWebhook(body) {
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
    async simulateCommand(dto) {
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
        const result = {};
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
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map