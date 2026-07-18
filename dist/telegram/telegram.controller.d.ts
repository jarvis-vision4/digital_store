import { TelegramService } from './telegram.service';
import { SimulateCommandDto } from './dto/telegram.dto';
export declare class TelegramController {
    private telegramService;
    constructor(telegramService: TelegramService);
    handleWebhook(body: any): Promise<{
        method: string;
        chat_id: number;
        text: string;
    }>;
    simulateCommand(dto: SimulateCommandDto): Promise<{
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
