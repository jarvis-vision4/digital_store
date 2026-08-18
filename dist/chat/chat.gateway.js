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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const enums_1 = require("../common/enums");
let ChatGateway = class ChatGateway {
    jwtService;
    prisma;
    server;
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
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
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token;
            if (!token)
                throw new common_1.UnauthorizedException();
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: BigInt(payload.sub) },
                select: { id: true, username: true, role: true, isActive: true },
            });
            if (!user || !user.isActive)
                throw new common_1.UnauthorizedException();
            const socketUser = {
                id: Number(user.id),
                username: user.username,
                role: user.role,
            };
            client.data.user = socketUser;
            if (socketUser.role === enums_1.UserRole.ADMIN || socketUser.role === enums_1.UserRole.MODERATOR) {
                await client.join('admins');
            }
            else {
                await client.join(`user:${socketUser.id}`);
            }
        }
        catch {
            client.disconnect();
        }
    }
    handleDisconnect() {
    }
    getUser(client) {
        const user = client.data.user;
        if (!user)
            throw new common_1.UnauthorizedException();
        return user;
    }
    async onUserSend(client, body) {
        const user = this.getUser(client);
        if (user.role !== enums_1.UserRole.CUSTOMER)
            throw new common_1.ForbiddenException();
        const content = body?.content?.trim();
        if (!content)
            return { event: 'error', data: 'Message is empty' };
        if (content.length > 2000)
            return { event: 'error', data: 'Message too long' };
        const message = await this.prisma.chatMessage.create({
            data: {
                userId: BigInt(user.id),
                senderRole: enums_1.UserRole.CUSTOMER,
                content,
            },
        });
        const serialized = this.serialize(message);
        this.server.to('admins').emit('chat:message', serialized);
        client.emit('chat:message', serialized);
        return { event: 'ok', data: serialized };
    }
    async onAdminSend(client, body) {
        const admin = this.getUser(client);
        if (admin.role !== enums_1.UserRole.ADMIN && admin.role !== enums_1.UserRole.MODERATOR) {
            throw new common_1.ForbiddenException();
        }
        const targetUserId = Number(body?.userId);
        const content = body?.content?.trim();
        if (!targetUserId || !content)
            return { event: 'error', data: 'Invalid payload' };
        if (content.length > 2000)
            return { event: 'error', data: 'Message too long' };
        const message = await this.prisma.chatMessage.create({
            data: {
                userId: BigInt(targetUserId),
                senderRole: admin.role,
                content,
            },
        });
        const serialized = this.serialize(message);
        this.server.to(`user:${targetUserId}`).emit('chat:message', serialized);
        this.server.to('admins').emit('chat:message', serialized);
        return { event: 'ok', data: serialized };
    }
    async onUserRead(client) {
        const user = this.getUser(client);
        await this.prisma.chatMessage.updateMany({
            where: {
                userId: BigInt(user.id),
                senderRole: { in: [enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR] },
                readByUserAt: null,
            },
            data: { readByUserAt: new Date() },
        });
        client.emit('chat:unread', { unread: 0 });
        return { event: 'ok' };
    }
    async onAdminRead(client, body) {
        const admin = this.getUser(client);
        if (admin.role !== enums_1.UserRole.ADMIN && admin.role !== enums_1.UserRole.MODERATOR) {
            throw new common_1.ForbiddenException();
        }
        const targetUserId = Number(body?.userId);
        if (!targetUserId)
            return { event: 'error', data: 'Invalid payload' };
        await this.prisma.chatMessage.updateMany({
            where: {
                userId: BigInt(targetUserId),
                senderRole: enums_1.UserRole.CUSTOMER,
                readByAdminAt: null,
            },
            data: { readByAdminAt: new Date() },
        });
        this.server.to('admins').emit('admin:read', { userId: targetUserId, unread: 0 });
        return { event: 'ok' };
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:send'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onUserSend", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('admin:send'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onAdminSend", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onUserRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('admin:read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onAdminRead", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        transports: ['websocket', 'polling'],
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map