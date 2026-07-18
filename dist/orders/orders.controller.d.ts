import { OrdersService } from './orders.service';
import { CreateOrderDto, RateOrderDto } from './dto/orders.dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    getPublicReviews(): Promise<{
        user: {
            username: string;
        };
        id: string;
        createdAt: Date;
        packageName: string;
        gameName: string;
        rating: number | null;
        reviewText: string | null;
    }[]>;
    userOrders(userId: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        packageName: string;
        gameId: string | null;
        gameName: string;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        playerId: string | null;
        zoneId: string | null;
        rating: number | null;
        reviewText: string | null;
        deliveryContent: string | null;
    }[]>;
    create(userId: number, dto: CreateOrderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        packageName: string;
        gameId: string | null;
        gameName: string;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        playerId: string | null;
        zoneId: string | null;
        rating: number | null;
        reviewText: string | null;
        deliveryContent: string | null;
    }>;
    rateOrder(userId: number, orderId: string, dto: RateOrderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        packageName: string;
        gameId: string | null;
        gameName: string;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        playerId: string | null;
        zoneId: string | null;
        rating: number | null;
        reviewText: string | null;
        deliveryContent: string | null;
    }>;
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
        packageName: string;
        gameId: string | null;
        gameName: string;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        playerId: string | null;
        zoneId: string | null;
        rating: number | null;
        reviewText: string | null;
        deliveryContent: string | null;
    })[]>;
    deliverOrder(orderId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        packageName: string;
        gameId: string | null;
        gameName: string;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        playerId: string | null;
        zoneId: string | null;
        rating: number | null;
        reviewText: string | null;
        deliveryContent: string | null;
    }>;
    cancelOrder(orderId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        packageName: string;
        gameId: string | null;
        gameName: string;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        playerId: string | null;
        zoneId: string | null;
        rating: number | null;
        reviewText: string | null;
        deliveryContent: string | null;
    }>;
    deleteOrder(orderId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        packageName: string;
        gameId: string | null;
        gameName: string;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        playerId: string | null;
        zoneId: string | null;
        rating: number | null;
        reviewText: string | null;
        deliveryContent: string | null;
    }>;
}
