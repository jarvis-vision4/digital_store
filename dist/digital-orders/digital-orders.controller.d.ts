import { DigitalOrdersService } from './digital-orders.service';
import { CreateDigitalOrderDto } from './dto/digital-orders.dto';
export declare class DigitalOrdersController {
    private digitalOrdersService;
    constructor(digitalOrdersService: DigitalOrdersService);
    create(userId: number, dto: CreateDigitalOrderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        digitalProductId: bigint;
        productName: string;
        variantName: string | null;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        digitalProductVariantId: bigint | null;
    }>;
    createByProductId(userId: number, productId: string, body: {
        variantId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        digitalProductId: bigint;
        productName: string;
        variantName: string | null;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        digitalProductVariantId: bigint | null;
    }>;
    userOrders(userId: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        digitalProductId: bigint;
        productName: string;
        variantName: string | null;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        digitalProductVariantId: bigint | null;
    }[]>;
    adminOrders(): Promise<({
        user: {
            username: string;
            id: bigint;
        };
        digitalProduct: {
            name: string;
        };
        digitalProductVariant: {
            name: string;
            durationDays: number;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        digitalProductId: bigint;
        productName: string;
        variantName: string | null;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        digitalProductVariantId: bigint | null;
    })[]>;
    deleteOrder(orderId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        digitalProductId: bigint;
        productName: string;
        variantName: string | null;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        digitalProductVariantId: bigint | null;
    }>;
    approveOrder(orderId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        digitalProductId: bigint;
        productName: string;
        variantName: string | null;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        digitalProductVariantId: bigint | null;
    }>;
    rejectOrder(orderId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: bigint;
        digitalProductId: bigint;
        productName: string;
        variantName: string | null;
        amountMmk: import("@prisma/client/runtime/library").Decimal;
        deliveryContent: string | null;
        digitalProductVariantId: bigint | null;
    }>;
}
