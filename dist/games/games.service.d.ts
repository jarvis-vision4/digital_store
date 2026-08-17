import { PrismaService } from '../prisma/prisma.service';
import { CreateDigitalProductDto } from './dto/games.dto';
export declare class GamesService {
    private prisma;
    constructor(prisma: PrismaService);
    private productInclude;
    getDigitalProducts(): Promise<any[]>;
    getDigitalProductById(id: string): Promise<any>;
    storeDigitalProduct(dto: CreateDigitalProductDto, imagePath?: string): Promise<any>;
    updateDigitalProduct(id: string, dto: CreateDigitalProductDto, imagePath?: string): Promise<any>;
    private syncVariants;
    getDigitalProductsAdmin(): Promise<any[]>;
    deleteDigitalProduct(id: string): Promise<{
        message: string;
    }>;
    addVariant(productId: string, dto: any): Promise<{
        id: bigint;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        durationDays: number;
        priceMmk: import("@prisma/client/runtime/library").Decimal;
        priceUsd: import("@prisma/client/runtime/library").Decimal | null;
        badge: string | null;
        sortOrder: number;
        digitalProductId: bigint;
    }>;
    updateVariant(variantId: string, dto: any): Promise<{
        id: bigint;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        durationDays: number;
        priceMmk: import("@prisma/client/runtime/library").Decimal;
        priceUsd: import("@prisma/client/runtime/library").Decimal | null;
        badge: string | null;
        sortOrder: number;
        digitalProductId: bigint;
    }>;
    deleteVariant(variantId: string): Promise<{
        id: bigint;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        durationDays: number;
        priceMmk: import("@prisma/client/runtime/library").Decimal;
        priceUsd: import("@prisma/client/runtime/library").Decimal | null;
        badge: string | null;
        sortOrder: number;
        digitalProductId: bigint;
    }>;
    addFeature(productId: string, dto: {
        name: string;
        sortOrder?: number;
    }): Promise<{
        id: bigint;
        createdAt: Date;
        name: string;
        sortOrder: number;
        digitalProductId: bigint;
    }>;
    deleteFeature(featureId: string): Promise<{
        id: bigint;
        createdAt: Date;
        name: string;
        sortOrder: number;
        digitalProductId: bigint;
    }>;
    private withStockFlags;
}
