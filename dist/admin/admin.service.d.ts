import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getUsers(): Promise<{
        username: string;
        email: string | null;
        referralCode: string;
        id: bigint;
        walletBalance: import("@prisma/client/runtime/library").Decimal;
        vipLevel: number;
        vipName: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    updateUserRole(username: string, role: string): Promise<{
        username: string;
        id: bigint;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    getReferrals(): Promise<({
        referrer: {
            username: string;
            id: bigint;
        };
        referee: {
            username: string;
            id: bigint;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        referrerId: bigint;
        refereeId: bigint;
        bonusAmountMmk: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.ReferralStatus;
    })[]>;
    rewardReferral(referralId: string): Promise<{
        message: string;
    }>;
}
