import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, ChangePasswordDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            username: string;
            role: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            username: string;
            role: string;
        };
    }>;
    getProfile(userId: number): Promise<{
        walletBalance: number;
        username: string;
        email: string | null;
        referralCode: string;
        id: bigint;
        referredBy: string | null;
        vipLevel: number;
        vipName: string;
        discountRate: import("@prisma/client/runtime/library").Decimal;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    changePassword(userId: number, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getReferralInfo(userId: number): Promise<{
        referralCode: string | undefined;
        totalReferrals: number;
        totalBonus: number;
        referrals: ({
            referee: {
                username: string;
                createdAt: Date;
            };
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            referrerId: bigint;
            refereeId: bigint;
            bonusAmountMmk: import("@prisma/client/runtime/library").Decimal;
            status: import("@prisma/client").$Enums.ReferralStatus;
        })[];
    }>;
    private generateToken;
}
