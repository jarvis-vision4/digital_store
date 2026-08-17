import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, RateOrderDto } from './dto/orders.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, dto: CreateOrderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        rating: number | null;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        gameId: string | null;
        gameName: string;
        packageName: string;
        playerId: string | null;
        zoneId: string | null;
        reviewText: string | null;
    }>;
    userOrders(userId: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        rating: number | null;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        gameId: string | null;
        gameName: string;
        packageName: string;
        playerId: string | null;
        zoneId: string | null;
        reviewText: string | null;
    }[]>;
    rateOrder(userId: number, orderId: string, dto: RateOrderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        rating: number | null;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        gameId: string | null;
        gameName: string;
        packageName: string;
        playerId: string | null;
        zoneId: string | null;
        reviewText: string | null;
    }>;
    getPublicReviews(): Promise<{
        user: {
            username: string;
        };
        id: string;
        createdAt: Date;
        rating: number | null;
        gameName: string;
        packageName: string;
        reviewText: string | null;
    }[]>;
    adminOrders(): Promise<({
        user: {
            username: string;
            id: bigint;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        rating: number | null;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        gameId: string | null;
        gameName: string;
        packageName: string;
        playerId: string | null;
        zoneId: string | null;
        reviewText: string | null;
    })[]>;
    deliverOrder(orderId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        rating: number | null;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        gameId: string | null;
        gameName: string;
        packageName: string;
        playerId: string | null;
        zoneId: string | null;
        reviewText: string | null;
    }>;
    cancelOrder(orderId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        rating: number | null;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        gameId: string | null;
        gameName: string;
        packageName: string;
        playerId: string | null;
        zoneId: string | null;
        reviewText: string | null;
    }>;
    deleteOrder(orderId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        rating: number | null;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        gameId: string | null;
        gameName: string;
        packageName: string;
        playerId: string | null;
        zoneId: string | null;
        reviewText: string | null;
    }>;
}
