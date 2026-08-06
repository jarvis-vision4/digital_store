import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto, UpdateGameDto, CreatePackageDto, UpdatePackageDto, CreateDigitalProductDto } from './dto/games.dto';
export declare class GamesService {
    private prisma;
    constructor(prisma: PrismaService);
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
    create(dto: CreateGameDto, imagePath?: string): Promise<{
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
    update(id: string, dto: UpdateGameDto, imagePath?: string): Promise<{
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
    addPackage(gameId: string, dto: CreatePackageDto): Promise<{
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
    storeDigitalProduct(dto: CreateDigitalProductDto, imagePath?: string): Promise<any>;
    updateDigitalProduct(id: string, dto: CreateDigitalProductDto, imagePath?: string): Promise<any>;
    getDigitalProductsAdmin(): Promise<any[]>;
    private withStockFlags;
}
