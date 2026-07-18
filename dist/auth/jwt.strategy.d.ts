import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: {
        sub: string;
        username: string;
        role: string;
    }): Promise<{
        id: number;
        username: string;
        email: string | null;
        referralCode: string;
        walletBalance: import("@prisma/client/runtime/library").Decimal;
        vipLevel: number;
        vipName: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
    }>;
}
export {};
