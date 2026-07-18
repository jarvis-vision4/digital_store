import { PrismaService } from '../prisma/prisma.service';
export declare class TelegramService {
    private prisma;
    constructor(prisma: PrismaService);
    handleWebhook(body: any): Promise<{
        method: string;
        chat_id: number;
        text: string;
    }>;
    simulateCommand(dto: {
        command: string;
        chatId?: string;
        username?: string;
    }): Promise<{
        method: string;
        chat_id: number;
        text: string;
    }>;
    getDiagnostics(): Promise<{
        settings: Record<string, any>;
        recentOrders: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.OrderStatus;
        }[];
        botActive: boolean;
    }>;
    clearDiagnostics(): Promise<{
        message: string;
    }>;
}
