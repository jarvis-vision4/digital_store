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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const game = await this.prisma.game.findUnique({
            where: { id: dto.gameId },
        });
        if (!game)
            throw new common_1.NotFoundException('Game not found');
        const user = await this.prisma.user.findUnique({
            where: { id: BigInt(userId) },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const discountRate = Number(user.discountRate);
        const finalAmount = dto.amountMmk * (1 - discountRate);
        if (Number(user.walletBalance) < finalAmount) {
            throw new common_1.BadRequestException('Insufficient wallet balance');
        }
        const orderId = (0, uuid_1.v4)();
        const [order] = await this.prisma.$transaction([
            this.prisma.order.create({
                data: {
                    id: orderId,
                    userId: BigInt(userId),
                    gameId: dto.gameId,
                    gameName: dto.gameName,
                    packageName: dto.packageName,
                    amountMmk: finalAmount,
                    playerId: dto.playerId,
                    zoneId: dto.zoneId,
                    status: 'Pending',
                },
            }),
            this.prisma.user.update({
                where: { id: BigInt(userId) },
                data: { walletBalance: { decrement: finalAmount } },
            }),
            this.prisma.walletTransaction.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    userId: BigInt(userId),
                    amount: -finalAmount,
                    type: 'ORDER_SPEND',
                    paymentMethod: 'Wallet',
                    phone: '',
                    status: 'Success',
                },
            }),
        ]);
        return order;
    }
    async userOrders(userId) {
        return this.prisma.order.findMany({
            where: { userId: BigInt(userId) },
            orderBy: { createdAt: 'desc' },
        });
    }
    async rateOrder(userId, orderId, dto) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (Number(order.userId) !== userId) {
            throw new common_1.BadRequestException('This order does not belong to you');
        }
        if (order.status !== 'Success') {
            throw new common_1.BadRequestException('Can only rate completed orders');
        }
        if (order.rating != null) {
            throw new common_1.BadRequestException('Order already rated');
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data: {
                rating: dto.rating,
                reviewText: dto.reviewText,
            },
        });
    }
    async getPublicReviews() {
        return this.prisma.order.findMany({
            where: {
                status: 'Success',
                rating: { not: null },
                reviewText: { not: null },
            },
            select: {
                id: true,
                gameName: true,
                packageName: true,
                rating: true,
                reviewText: true,
                createdAt: true,
                user: {
                    select: { username: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async adminOrders() {
        return this.prisma.order.findMany({
            include: {
                user: {
                    select: { id: true, username: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deliverOrder(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.status !== 'Pending') {
            throw new common_1.BadRequestException('Order is not in pending status');
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'Success' },
        });
    }
    async cancelOrder(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.status !== 'Pending') {
            throw new common_1.BadRequestException('Can only cancel pending orders');
        }
        const refundAmount = Number(order.amountMmk);
        const [updatedOrder] = await this.prisma.$transaction([
            this.prisma.order.update({
                where: { id: orderId },
                data: { status: 'Cancelled' },
            }),
            this.prisma.user.update({
                where: { id: order.userId },
                data: { walletBalance: { increment: refundAmount } },
            }),
            this.prisma.walletTransaction.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    userId: order.userId,
                    amount: refundAmount,
                    type: 'REFUND',
                    paymentMethod: 'Wallet',
                    phone: '',
                    status: 'Success',
                },
            }),
        ]);
        return updatedOrder;
    }
    async deleteOrder(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return this.prisma.order.delete({
            where: { id: orderId },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map