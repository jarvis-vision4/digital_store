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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const enums_1 = require("../common/enums");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                isActive: true,
                vipLevel: true,
                vipName: true,
                walletBalance: true,
                referralCode: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateUserRole(username, role) {
        const validRole = Object.values(enums_1.UserRole).includes(role);
        if (!validRole) {
            throw new common_1.BadRequestException('Invalid role. Must be ADMIN, MODERATOR, or CUSTOMER');
        }
        const user = await this.prisma.user.findUnique({ where: { username } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { username },
            data: { role: role },
            select: {
                id: true,
                username: true,
                role: true,
            },
        });
    }
    async getReferrals() {
        return this.prisma.referral.findMany({
            include: {
                referrer: {
                    select: { id: true, username: true },
                },
                referee: {
                    select: { id: true, username: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async rewardReferral(referralId) {
        const referral = await this.prisma.referral.findUnique({
            where: { id: BigInt(referralId) },
        });
        if (!referral)
            throw new common_1.NotFoundException('Referral not found');
        if (referral.status !== 'Pending') {
            throw new common_1.BadRequestException('Referral already rewarded');
        }
        const bonusAmount = Number(referral.bonusAmountMmk);
        const transaction = await this.prisma.walletTransaction.findFirst({
            where: {
                userId: referral.referrerId,
                type: 'REFERRAL_BONUS',
                status: 'Pending',
                amount: bonusAmount,
            },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Referral wallet transaction not found');
        }
        await this.prisma.$transaction([
            this.prisma.referral.update({
                where: { id: BigInt(referralId) },
                data: { status: 'Rewarded' },
            }),
            this.prisma.walletTransaction.update({
                where: { id: transaction.id },
                data: { status: 'Success' },
            }),
            this.prisma.user.update({
                where: { id: referral.referrerId },
                data: { walletBalance: { increment: bonusAmount } },
            }),
        ]);
        return { message: 'Referral rewarded successfully' };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map