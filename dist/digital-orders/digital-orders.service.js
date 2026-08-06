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
exports.DigitalOrdersService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const prisma_service_1 = require("../prisma/prisma.service");
let DigitalOrdersService = class DigitalOrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const product = await this.prisma.digitalProduct.findUnique({
            where: { id: BigInt(dto.digitalProductId) },
        });
        if (!product)
            throw new common_1.NotFoundException('Digital product not found');
        const user = await this.prisma.user.findUnique({
            where: { id: BigInt(userId) },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (Number(user.walletBalance) < dto.amountMmk) {
            throw new common_1.BadRequestException('Insufficient wallet balance');
        }
        const orderId = (0, uuid_1.v4)();
        const [order] = await this.prisma.$transaction([
            this.prisma.digitalOrder.create({
                data: {
                    id: orderId,
                    userId: BigInt(userId),
                    digitalProductId: product.id,
                    productName: dto.productName,
                    amountMmk: dto.amountMmk,
                    status: 'Pending',
                    deliveryContent: product.description || 'Digital product delivery',
                },
            }),
            this.prisma.user.update({
                where: { id: BigInt(userId) },
                data: { walletBalance: { decrement: dto.amountMmk } },
            }),
            this.prisma.walletTransaction.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    userId: BigInt(userId),
                    amount: -dto.amountMmk,
                    type: 'ORDER_SPEND',
                    paymentMethod: 'Wallet',
                    phone: '',
                    status: 'Success',
                },
            }),
        ]);
        return order;
    }
    async createByProductId(userId, productId) {
        const product = await this.prisma.digitalProduct.findUnique({
            where: { id: BigInt(productId) },
        });
        if (!product)
            throw new common_1.NotFoundException('Digital product not found');
        const user = await this.prisma.user.findUnique({
            where: { id: BigInt(userId) },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const amount = Number(product.priceMmk);
        if (Number(user.walletBalance) < amount) {
            throw new common_1.BadRequestException('Insufficient wallet balance');
        }
        const orderId = (0, uuid_1.v4)();
        const [order] = await this.prisma.$transaction([
            this.prisma.digitalOrder.create({
                data: {
                    id: orderId,
                    userId: BigInt(userId),
                    digitalProductId: product.id,
                    productName: product.name,
                    amountMmk: amount,
                    status: 'Pending',
                    deliveryContent: product.description || 'Digital product delivery',
                },
            }),
            this.prisma.user.update({
                where: { id: BigInt(userId) },
                data: { walletBalance: { decrement: amount } },
            }),
            this.prisma.walletTransaction.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    userId: BigInt(userId),
                    amount: -amount,
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
        return this.prisma.digitalOrder.findMany({
            where: { userId: BigInt(userId) },
            orderBy: { createdAt: 'desc' },
        });
    }
    async adminOrders() {
        return this.prisma.digitalOrder.findMany({
            include: {
                user: { select: { id: true, username: true } },
                digitalProduct: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteOrder(orderId) {
        const order = await this.prisma.digitalOrder.findUnique({
            where: { id: orderId },
        });
        if (!order)
            throw new common_1.NotFoundException('Digital order not found');
        return this.prisma.digitalOrder.delete({
            where: { id: orderId },
        });
    }
    async approveOrder(orderId) {
        const order = await this.prisma.digitalOrder.findUnique({
            where: { id: orderId },
        });
        if (!order)
            throw new common_1.NotFoundException('Digital order not found');
        if (order.status !== 'Pending') {
            throw new common_1.BadRequestException('Order is not in pending status');
        }
        return this.prisma.digitalOrder.update({
            where: { id: orderId },
            data: { status: 'Success' },
        });
    }
    async rejectOrder(orderId) {
        const order = await this.prisma.digitalOrder.findUnique({
            where: { id: orderId },
        });
        if (!order)
            throw new common_1.NotFoundException('Digital order not found');
        if (order.status !== 'Pending') {
            throw new common_1.BadRequestException('Order is not in pending status');
        }
        const refundAmount = Number(order.amountMmk);
        const [updatedOrder] = await this.prisma.$transaction([
            this.prisma.digitalOrder.update({
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
};
exports.DigitalOrdersService = DigitalOrdersService;
exports.DigitalOrdersService = DigitalOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DigitalOrdersService);
//# sourceMappingURL=digital-orders.service.js.map