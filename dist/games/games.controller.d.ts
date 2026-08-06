import { GamesService } from './games.service';
import { UpdateGameDto, CreatePackageDto, UpdatePackageDto, CreateDigitalProductDto } from './dto/games.dto';
export declare class GamesController {
    private gamesService;
    constructor(gamesService: GamesService);
    findAll(): Promise<({
        packages: {
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            packageName: string;
            priceMmk: import("@prisma/client/runtime/library").Decimal;
            stockQuantity: number;
            originalPrice: import("@prisma/client/runtime/library").Decimal | null;
            gameId: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        category: import("@prisma/client").$Enums.GameCategory;
        image: string;
        posterUrl: string | null;
        minAmount: string;
        popular: boolean;
        sortOrder: number;
    })[]>;
    findOne(id: string): Promise<{
        packages: {
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            packageName: string;
            priceMmk: import("@prisma/client/runtime/library").Decimal;
            stockQuantity: number;
            originalPrice: import("@prisma/client/runtime/library").Decimal | null;
            gameId: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        category: import("@prisma/client").$Enums.GameCategory;
        image: string;
        posterUrl: string | null;
        minAmount: string;
        popular: boolean;
        sortOrder: number;
    }>;
    upload(files?: {
        image?: Express.Multer.File[];
        file?: Express.Multer.File[];
    }): {
        url: string | undefined;
    };
    create(body: any, image?: Express.Multer.File): Promise<{
        packages: {
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            packageName: string;
            priceMmk: import("@prisma/client/runtime/library").Decimal;
            stockQuantity: number;
            originalPrice: import("@prisma/client/runtime/library").Decimal | null;
            gameId: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        category: import("@prisma/client").$Enums.GameCategory;
        image: string;
        posterUrl: string | null;
        minAmount: string;
        popular: boolean;
        sortOrder: number;
    }>;
    update(id: string, dto: UpdateGameDto, image?: Express.Multer.File): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        category: import("@prisma/client").$Enums.GameCategory;
        image: string;
        posterUrl: string | null;
        minAmount: string;
        popular: boolean;
        sortOrder: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        category: import("@prisma/client").$Enums.GameCategory;
        image: string;
        posterUrl: string | null;
        minAmount: string;
        popular: boolean;
        sortOrder: number;
    }>;
    addPackage(id: string, dto: CreatePackageDto): Promise<{
        id: bigint;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        packageName: string;
        priceMmk: import("@prisma/client/runtime/library").Decimal;
        stockQuantity: number;
        originalPrice: import("@prisma/client/runtime/library").Decimal | null;
        gameId: string;
    }>;
    updatePackage(packageId: string, dto: UpdatePackageDto): Promise<{
        id: bigint;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        packageName: string;
        priceMmk: import("@prisma/client/runtime/library").Decimal;
        stockQuantity: number;
        originalPrice: import("@prisma/client/runtime/library").Decimal | null;
        gameId: string;
    }>;
    getDigitalProducts(): Promise<any[]>;
    getDigitalProductsAdmin(): Promise<any[]>;
    storeDigitalProduct(dto: CreateDigitalProductDto, image?: Express.Multer.File): Promise<any>;
    updateDigitalProduct(id: string, dto: CreateDigitalProductDto, image?: Express.Multer.File): Promise<any>;
}
