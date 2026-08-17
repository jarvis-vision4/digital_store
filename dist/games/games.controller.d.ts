import { GamesService } from './games.service';
import { CreateDigitalProductDto } from './dto/games.dto';
export declare class GamesController {
    private gamesService;
    constructor(gamesService: GamesService);
    getDigitalProducts(): Promise<any[]>;
    getDigitalProductById(id: string): Promise<any>;
    getDigitalProductsAdmin(): Promise<any[]>;
    storeDigitalProduct(dto: CreateDigitalProductDto, image?: Express.Multer.File): Promise<any>;
    updateDigitalProduct(id: string, dto: CreateDigitalProductDto, image?: Express.Multer.File): Promise<any>;
    deleteDigitalProduct(id: string): Promise<{
        message: string;
    }>;
    addVariant(id: string, dto: any): Promise<{
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
    updateVariant(id: string, dto: any): Promise<{
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
    deleteVariant(id: string): Promise<{
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
    addFeature(id: string, dto: {
        name: string;
        sortOrder?: number;
    }): Promise<{
        id: bigint;
        createdAt: Date;
        name: string;
        sortOrder: number;
        digitalProductId: bigint;
    }>;
    deleteFeature(id: string): Promise<{
        id: bigint;
        createdAt: Date;
        name: string;
        sortOrder: number;
        digitalProductId: bigint;
    }>;
}
