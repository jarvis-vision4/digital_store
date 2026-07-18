import { PrismaService } from '../prisma/prisma.service';
import { CreateDigitalOrderDto } from './dto/digital-orders.dto';
export declare class DigitalOrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, dto: CreateDigitalOrderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        digitalProductId: bigint;
        productName: string;
    }>;
    createByProductId(userId: number, productId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        digitalProductId: bigint;
        productName: string;
    }>;
    userOrders(userId: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        digitalProductId: bigint;
        productName: string;
    }[]>;
    adminOrders(): Promise<({
        user: {
            username: string;
            id: bigint;
        };
        digitalProduct: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        digitalProductId: bigint;
        productName: string;
    })[]>;
    deleteOrder(orderId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        digitalProductId: bigint;
        productName: string;
    }>;
    approveOrder(orderId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        digitalProductId: bigint;
        productName: string;
    }>;
    rejectOrder(orderId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        digitalProductId: bigint;
        productName: string;
    }>;
}
