export declare class CreateVariantDto {
    name: string;
    durationDays: number;
    priceMmk: number;
    priceUsd?: number;
    badge?: string;
    sortOrder?: number;
    isActive?: boolean;
}
export declare class CreateFeatureDto {
    name: string;
    sortOrder?: number;
}
export declare class CreateDigitalProductDto {
    name: string;
    category?: string;
    description?: string;
    image?: string;
    priceMmk: number;
    rating?: number;
    badge?: string;
    isAvailable?: boolean;
    variants?: CreateVariantDto[];
    features?: CreateFeatureDto[];
}
