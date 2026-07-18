"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: dto.username },
                    ...(dto.email ? [{ email: dto.email }] : []),
                ],
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Username or email already exists');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const referralCode = (0, uuid_1.v4)().slice(0, 8).toUpperCase();
        let referredByUser = null;
        if (dto.referralCode) {
            referredByUser = await this.prisma.user.findUnique({
                where: { referralCode: dto.referralCode },
            });
            if (!referredByUser) {
                throw new common_1.BadRequestException('Invalid referral code');
            }
        }
        const user = await this.prisma.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                passwordHash,
                referralCode,
                referredBy: dto.referralCode || null,
            },
        });
        if (referredByUser) {
            await this.prisma.$transaction([
                this.prisma.referral.create({
                    data: {
                        referrerId: referredByUser.id,
                        refereeId: user.id,
                        bonusAmountMmk: 500,
                        status: 'Rewarded',
                    },
                }),
                this.prisma.walletTransaction.create({
                    data: {
                        id: (0, uuid_1.v4)(),
                        userId: referredByUser.id,
                        amount: 500,
                        type: 'REFERRAL_BONUS',
                        paymentMethod: 'Referral',
                        phone: '',
                        status: 'Success',
                    },
                }),
                this.prisma.user.update({
                    where: { id: referredByUser.id },
                    data: { walletBalance: { increment: 500 } },
                }),
            ]);
        }
        return this.generateToken(user);
    }
    async login(dto) {
        if (!dto.email) {
            throw new common_1.BadRequestException('Email is required');
        }
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateToken(user);
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: BigInt(userId) },
            select: {
                id: true,
                username: true,
                email: true,
                walletBalance: true,
                referralCode: true,
                referredBy: true,
                vipLevel: true,
                vipName: true,
                discountRate: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return { ...user, walletBalance: Number(user.walletBalance) };
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: BigInt(userId) },
        });
        if (!user)
            throw new common_1.UnauthorizedException();
        const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const passwordHash = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: BigInt(userId) },
            data: { passwordHash },
        });
        return { message: 'Password changed successfully' };
    }
    async getReferralInfo(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: BigInt(userId) },
            select: { referralCode: true },
        });
        const referrals = await this.prisma.referral.findMany({
            where: { referrerId: BigInt(userId) },
            include: {
                referee: {
                    select: { username: true, createdAt: true },
                },
            },
        });
        const totalReferrals = referrals.length;
        const totalBonus = referrals.reduce((sum, r) => sum + Number(r.bonusAmountMmk), 0);
        return {
            referralCode: user?.referralCode,
            totalReferrals,
            totalBonus,
            referrals,
        };
    }
    async generateToken(user) {
        const payload = {
            sub: String(user.id),
            username: user.username,
            role: user.role,
        };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: Number(user.id),
                username: user.username,
                role: user.role,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map