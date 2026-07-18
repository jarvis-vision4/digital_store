import { GameCategory } from '@prisma/client';
export declare class PackageItem {
    packageName: string;
    priceMmk: number;
    stockQuantity?: number;
    originalPrice?: number;
}
export declare class CreateGameDto {
    id: string;
    name: string;
    category: GameCategory;
    image: string;
    posterUrl?: string;
    description?: string;
    minAmount?: string;
    popular?: boolean;
    sortOrder?: number;
    packages: PackageItem[];
}
export declare class UpdateGameDto {
    name?: string;
    category?: GameCategory;
    image?: string;
    posterUrl?: string;
    description?: string;
    minAmount?: string;
    popular?: boolean;
    isActive?: boolean;
    sortOrder?: number;
}
export declare class CreatePackageDto {
    packageName: string;
    priceMmk: number;
    stockQuantity?: number;
    originalPrice?: number;
}
export declare class UpdatePackageDto {
    packageName?: string;
    priceMmk?: number;
    stockQuantity?: number;
    originalPrice?: number;
    isActive?: boolean;
}
export declare class CreateDigitalProductDto {
    name: string;
    category?: string;
    description?: string;
    priceMmk: number;
    stock?: number;
}
