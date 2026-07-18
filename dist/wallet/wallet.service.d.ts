import { PrismaService } from '../prisma/prisma.service';
import { SubmitDepositDto, RedeemCouponDto, GenerateCouponDto } from './dto/wallet.dto';
export declare class WalletService {
    private prisma;
    constructor(prisma: PrismaService);
    getBalance(userId: number): Promise<{
        balance: number;
    }>;
    userTransactions(userId: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.WalletTransactionStatus;
        userId: bigint;
        amount: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.WalletTransactionType;
        paymentMethod: string;
        phone: string;
        screenshotUrl: string | null;
        transactionId: string | null;
        rejectionReason: string | null;
    }[]>;
    submitDeposit(userId: number, dto: SubmitDepositDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.WalletTransactionStatus;
        userId: bigint;
        amount: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.WalletTransactionType;
        paymentMethod: string;
        phone: string;
        screenshotUrl: string | null;
        transactionId: string | null;
        rejectionReason: string | null;
    }>;
    redeemCoupon(userId: number, dto: RedeemCouponDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CouponStatus;
        amount: import("@prisma/client/runtime/library").Decimal;
        code: string;
        createdBy: string;
        redeemedBy: bigint | null;
    }>;
    adminTopupRequests(): Promise<({
        user: {
            username: string;
            id: bigint;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.WalletTransactionStatus;
        userId: bigint;
        amount: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.WalletTransactionType;
        paymentMethod: string;
        phone: string;
        screenshotUrl: string | null;
        transactionId: string | null;
        rejectionReason: string | null;
    })[]>;
    approveDeposit(transactionId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.WalletTransactionStatus;
        userId: bigint;
        amount: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.WalletTransactionType;
        paymentMethod: string;
        phone: string;
        screenshotUrl: string | null;
        transactionId: string | null;
        rejectionReason: string | null;
    }>;
    rejectDeposit(transactionId: string, reason?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.WalletTransactionStatus;
        userId: bigint;
        amount: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.WalletTransactionType;
        paymentMethod: string;
        phone: string;
        screenshotUrl: string | null;
        transactionId: string | null;
        rejectionReason: string | null;
    }>;
    getCouponsAdmin(): Promise<({
        redeemedByUser: {
            username: string;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CouponStatus;
        amount: import("@prisma/client/runtime/library").Decimal;
        code: string;
        createdBy: string;
        redeemedBy: bigint | null;
    })[]>;
    generateCoupon(dto: GenerateCouponDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CouponStatus;
        amount: import("@prisma/client/runtime/library").Decimal;
        code: string;
        createdBy: string;
        redeemedBy: bigint | null;
    }>;
}
