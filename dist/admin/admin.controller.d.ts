import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getUsers(): Promise<{
        username: string;
        email: string | null;
        referralCode: string;
        id: bigint;
        walletBalance: import("@prisma/client/runtime/library").Decimal;
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
    rewardReferral(id: string): Promise<{
        message: string;
    }>;
}
