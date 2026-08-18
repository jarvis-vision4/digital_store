import { PrismaService } from '../prisma/prisma.service';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    private serialize;
    userMessages(userId: number): Promise<{
        id: number;
        userId: number;
        senderRole: any;
        content: any;
        readByUserAt: any;
        readByAdminAt: any;
        createdAt: any;
    }[]>;
    userUnread(userId: number): Promise<{
        unread: number;
    }>;
    markUserRead(userId: number): Promise<{
        unread: number;
    }>;
    adminUsers(): Promise<{
        userId: number;
        username: string;
        lastMessage: string;
        lastMessageAt: Date;
        lastSender: import("@prisma/client").$Enums.UserRole;
        unread: number;
    }[]>;
    adminMessages(adminUserId: number, targetUserId: number): Promise<{
        id: number;
        userId: number;
        senderRole: any;
        content: any;
        readByUserAt: any;
        readByAdminAt: any;
        createdAt: any;
    }[]>;
    markAdminRead(adminUserId: number, targetUserId: number): Promise<{
        unread: number;
    }>;
    private ensureAdminTarget;
}
