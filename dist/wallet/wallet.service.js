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
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const prisma_service_1 = require("../prisma/prisma.service");
let WalletService = class WalletService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBalance(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: BigInt(userId) },
            select: { walletBalance: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return { balance: Number(user.walletBalance) };
    }
    async userTransactions(userId) {
        return this.prisma.walletTransaction.findMany({
            where: { userId: BigInt(userId) },
            orderBy: { createdAt: 'desc' },
        });
    }
    async submitDeposit(userId, dto) {
        return this.prisma.walletTransaction.create({
            data: {
                id: (0, uuid_1.v4)(),
                userId: BigInt(userId),
                amount: dto.amount,
                type: 'DEPOSIT',
                paymentMethod: dto.paymentMethod,
                phone: dto.phone,
                transactionId: dto.transactionId,
                screenshotUrl: dto.screenshotUrl,
                status: 'Pending',
            },
        });
    }
    async redeemCoupon(userId, dto) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code: dto.code },
        });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        if (coupon.status !== 'Active') {
            throw new common_1.BadRequestException('Coupon already redeemed');
        }
        const [updatedCoupon] = await this.prisma.$transaction([
            this.prisma.coupon.update({
                where: { code: dto.code },
                data: {
                    status: 'Redeemed',
                    redeemedBy: BigInt(userId),
                },
            }),
            this.prisma.user.update({
                where: { id: BigInt(userId) },
                data: { walletBalance: { increment: Number(coupon.amount) } },
            }),
            this.prisma.walletTransaction.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    userId: BigInt(userId),
                    amount: Number(coupon.amount),
                    type: 'REFERRAL_BONUS',
                    paymentMethod: 'Coupon',
                    phone: '',
                    status: 'Success',
                },
            }),
        ]);
        return updatedCoupon;
    }
    async adminTopupRequests() {
        return this.prisma.walletTransaction.findMany({
            where: { type: 'DEPOSIT', status: 'Pending' },
            include: {
                user: {
                    select: { id: true, username: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async approveDeposit(transactionId) {
        const transaction = await this.prisma.walletTransaction.findUnique({
            where: { id: transactionId },
        });
        if (!transaction)
            throw new common_1.NotFoundException('Transaction not found');
        if (transaction.status !== 'Pending') {
            throw new common_1.BadRequestException('Transaction already processed');
        }
        const [updatedTransaction] = await this.prisma.$transaction([
            this.prisma.walletTransaction.update({
                where: { id: transactionId },
                data: { status: 'Success' },
            }),
            this.prisma.user.update({
                where: { id: transaction.userId },
                data: { walletBalance: { increment: Number(transaction.amount) } },
            }),
        ]);
        return updatedTransaction;
    }
    async rejectDeposit(transactionId, reason) {
        const transaction = await this.prisma.walletTransaction.findUnique({
            where: { id: transactionId },
        });
        if (!transaction)
            throw new common_1.NotFoundException('Transaction not found');
        if (transaction.status !== 'Pending') {
            throw new common_1.BadRequestException('Transaction already processed');
        }
        return this.prisma.walletTransaction.update({
            where: { id: transactionId },
            data: {
                status: 'Cancelled',
                rejectionReason: reason || null,
            },
        });
    }
    async getCouponsAdmin() {
        return this.prisma.coupon.findMany({
            include: {
                redeemedByUser: {
                    select: { username: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async generateCoupon(dto) {
        return this.prisma.coupon.create({
            data: {
                code: dto.code,
                amount: dto.amount,
                createdBy: 'admin',
                status: 'Active',
            },
        });
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalletService);
//# sourceMappingURL=wallet.service.js.map