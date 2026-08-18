import { ChatService } from './chat.service';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    myMessages(userId: number): Promise<{
        id: number;
        userId: number;
        senderRole: any;
        content: any;
        readByUserAt: any;
        readByAdminAt: any;
        createdAt: any;
    }[]>;
    myUnread(userId: number): Promise<{
        unread: number;
    }>;
    markMyRead(userId: number): Promise<{
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
    adminMessages(adminUserId: number, userId: string): Promise<{
        id: number;
        userId: number;
        senderRole: any;
        content: any;
        readByUserAt: any;
        readByAdminAt: any;
        createdAt: any;
    }[]>;
    markAdminRead(adminUserId: number, userId: string): Promise<{
        unread: number;
    }>;
}
