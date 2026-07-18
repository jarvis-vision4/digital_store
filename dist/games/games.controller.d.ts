import { GamesService } from './games.service';
import { CreateGameDto, UpdateGameDto, CreatePackageDto, UpdatePackageDto, CreateDigitalProductDto } from './dto/games.dto';
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
    create(dto: CreateGameDto): Promise<{
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
    update(id: string, dto: UpdateGameDto): Promise<{
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
    getDigitalProducts(): Promise<{
        id: bigint;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        priceMmk: import("@prisma/client/runtime/library").Decimal;
        category: string;
        stock: number;
    }[]>;
    getDigitalProductsAdmin(): Promise<{
        id: bigint;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        priceMmk: import("@prisma/client/runtime/library").Decimal;
        category: string;
        stock: number;
    }[]>;
    storeDigitalProduct(dto: CreateDigitalProductDto): Promise<{
        id: bigint;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        priceMmk: import("@prisma/client/runtime/library").Decimal;
        category: string;
        stock: number;
    }>;
}
