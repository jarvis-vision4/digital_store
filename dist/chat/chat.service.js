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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const enums_1 = require("../common/enums");
let ChatService = class ChatService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    serialize(message) {
        return {
            id: Number(message.id),
            userId: Number(message.userId),
            senderRole: message.senderRole,
            content: message.content,
            readByUserAt: message.readByUserAt,
            readByAdminAt: message.readByAdminAt,
            createdAt: message.createdAt,
        };
    }
    async userMessages(userId) {
        const messages = await this.prisma.chatMessage.findMany({
            where: { userId: BigInt(userId) },
            orderBy: { createdAt: 'asc' },
            take: 200,
        });
        return messages.map((m) => this.serialize(m));
    }
    async userUnread(userId) {
        const count = await this.prisma.chatMessage.count({
            where: {
                userId: BigInt(userId),
                senderRole: { in: [enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR] },
                readByUserAt: null,
            },
        });
        return { unread: count };
    }
    async markUserRead(userId) {
        await this.prisma.chatMessage.updateMany({
            where: {
                userId: BigInt(userId),
                senderRole: { in: [enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR] },
                readByUserAt: null,
            },
            data: { readByUserAt: new Date() },
        });
        return { unread: 0 };
    }
    async adminUsers() {
        const users = await this.prisma.user.findMany({
            where: { chatMessages: { some: {} } },
            select: {
                id: true,
                username: true,
                chatMessages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { content: true, createdAt: true, senderRole: true },
                },
                _count: {
                    select: {
                        chatMessages: {
                            where: { senderRole: enums_1.UserRole.CUSTOMER, readByAdminAt: null },
                        },
                    },
                },
            },
        });
        return users
            .map((u) => ({
            userId: Number(u.id),
            username: u.username,
            lastMessage: u.chatMessages[0]?.content ?? null,
            lastMessageAt: u.chatMessages[0]?.createdAt ?? null,
            lastSender: u.chatMessages[0]?.senderRole ?? null,
            unread: u._count.chatMessages,
        }))
            .sort((a, b) => (b.lastMessageAt?.getTime() ?? 0) - (a.lastMessageAt?.getTime() ?? 0));
    }
    async adminMessages(adminUserId, targetUserId) {
        await this.ensureAdminTarget(adminUserId, targetUserId);
        const messages = await this.prisma.chatMessage.findMany({
            where: { userId: BigInt(targetUserId) },
            orderBy: { createdAt: 'asc' },
            take: 200,
        });
        return messages.map((m) => this.serialize(m));
    }
    async markAdminRead(adminUserId, targetUserId) {
        await this.ensureAdminTarget(adminUserId, targetUserId);
        await this.prisma.chatMessage.updateMany({
            where: {
                userId: BigInt(targetUserId),
                senderRole: enums_1.UserRole.CUSTOMER,
                readByAdminAt: null,
            },
            data: { readByAdminAt: new Date() },
        });
        return { unread: 0 };
    }
    async ensureAdminTarget(adminUserId, targetUserId) {
        const target = await this.prisma.user.findUnique({
            where: { id: BigInt(targetUserId) },
            select: { id: true, username: true },
        });
        if (!target)
            throw new common_1.NotFoundException('User not found');
        if (Number(target.id) === adminUserId) {
            throw new common_1.ForbiddenException('Cannot chat with yourself');
        }
        return target;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map