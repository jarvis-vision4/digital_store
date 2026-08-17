"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GamesService = class GamesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    productInclude = {
        variants: { orderBy: { sortOrder: 'asc' } },
        features: { orderBy: { sortOrder: 'asc' } },
    };
    async getDigitalProducts() {
        const products = await this.prisma.digitalProduct.findMany({
            where: { isActive: true },
            include: this.productInclude,
        });
        return products.map((p) => this.withStockFlags(p));
    }
    async getDigitalProductById(id) {
        const product = await this.prisma.digitalProduct.findUnique({
            where: { id: BigInt(id) },
            include: this.productInclude,
        });
        if (!product)
            throw new common_1.NotFoundException('Digital product not found');
        return this.withStockFlags(product);
    }
    async storeDigitalProduct(dto, imagePath) {
        const { variants, features, ...productData } = dto;
        const product = await this.prisma.digitalProduct.create({
            data: {
                ...productData,
                ...(imagePath ? { image: imagePath } : {}),
                ...(variants?.length
                    ? {
                        variants: {
                            create: variants.map((v, i) => ({
                                ...v,
                                sortOrder: v.sortOrder ?? i,
                            })),
                        },
                    }
                    : {}),
                ...(features?.length
                    ? {
                        features: {
                            create: features.map((f, i) => ({
                                name: f.name,
                                sortOrder: f.sortOrder ?? i,
                            })),
                        },
                    }
                    : {}),
            },
            include: this.productInclude,
        });
        return this.withStockFlags(product);
    }
    async updateDigitalProduct(id, dto, imagePath) {
        const existing = await this.prisma.digitalProduct.findUnique({
            where: { id: BigInt(id) },
        });
        if (!existing)
            throw new common_1.NotFoundException('Digital product not found');
        const { variants, features, ...productData } = dto;
        const updateData = {
            ...productData,
            ...(imagePath ? { image: imagePath } : {}),
        };
        if (variants) {
            await this.syncVariants(id, variants);
        }
        if (features) {
            await this.prisma.digitalProductFeature.deleteMany({
                where: { digitalProductId: BigInt(id) },
            });
            if (features.length > 0) {
                updateData.features = {
                    create: features.map((f, i) => ({
                        name: f.name,
                        sortOrder: f.sortOrder ?? i,
                    })),
                };
            }
        }
        const updated = await this.prisma.digitalProduct.update({
            where: { id: BigInt(id) },
            data: updateData,
            include: this.productInclude,
        });
        return this.withStockFlags(updated);
    }
    async syncVariants(productId, variants) {
        const productBigInt = BigInt(productId);
        const existingVariants = await this.prisma.digitalProductVariant.findMany({
            where: { digitalProductId: productBigInt },
        });
        const incomingIds = new Set();
        for (const v of variants) {
            if (v.id) {
                incomingIds.add(String(v.id));
                await this.prisma.digitalProductVariant.update({
                    where: { id: BigInt(v.id) },
                    data: {
                        name: v.name,
                        durationDays: v.durationDays,
                        priceMmk: v.priceMmk,
                        priceUsd: v.priceUsd,
                        badge: v.badge,
                        sortOrder: v.sortOrder ?? 0,
                        isActive: v.isActive ?? true,
                    },
                });
            }
            else {
                await this.prisma.digitalProductVariant.create({
                    data: {
                        digitalProductId: productBigInt,
                        name: v.name,
                        durationDays: v.durationDays,
                        priceMmk: v.priceMmk,
                        priceUsd: v.priceUsd,
                        badge: v.badge,
                        sortOrder: v.sortOrder ?? 0,
                        isActive: v.isActive ?? true,
                    },
                });
            }
        }
        for (const ev of existingVariants) {
            if (incomingIds.has(String(ev.id)))
                continue;
            try {
                await this.prisma.digitalProductVariant.delete({ where: { id: ev.id } });
            }
            catch {
                await this.prisma.digitalProductVariant.update({
                    where: { id: ev.id },
                    data: { isActive: false },
                });
            }
        }
    }
    async getDigitalProductsAdmin() {
        const products = await this.prisma.digitalProduct.findMany({
            where: { isActive: true },
            include: this.productInclude,
            orderBy: { createdAt: 'desc' },
        });
        return products.map((p) => this.withStockFlags(p));
    }
    async deleteDigitalProduct(id) {
        const product = await this.prisma.digitalProduct.findUnique({
            where: { id: BigInt(id) },
        });
        if (!product)
            throw new common_1.NotFoundException('Digital product not found');
        const orderCount = await this.prisma.digitalOrder.count({
            where: { digitalProductId: BigInt(id) },
        });
        if (orderCount > 0) {
            await this.prisma.digitalProduct.update({
                where: { id: BigInt(id) },
                data: { isActive: false },
            });
            return { message: 'Product hidden (has order history)' };
        }
        await this.prisma.digitalProductVariant.deleteMany({
            where: { digitalProductId: BigInt(id) },
        });
        await this.prisma.digitalProductFeature.deleteMany({
            where: { digitalProductId: BigInt(id) },
        });
        await this.prisma.digitalProduct.delete({ where: { id: BigInt(id) } });
        return { message: 'Product deleted' };
    }
    async addVariant(productId, dto) {
        const product = await this.prisma.digitalProduct.findUnique({
            where: { id: BigInt(productId) },
        });
        if (!product)
            throw new common_1.NotFoundException('Digital product not found');
        return this.prisma.digitalProductVariant.create({
            data: {
                digitalProductId: BigInt(productId),
                name: dto.name,
                durationDays: dto.durationDays,
                priceMmk: dto.priceMmk,
                priceUsd: dto.priceUsd,
                badge: dto.badge,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
    }
    async updateVariant(variantId, dto) {
        const variant = await this.prisma.digitalProductVariant.findUnique({
            where: { id: BigInt(variantId) },
        });
        if (!variant)
            throw new common_1.NotFoundException('Variant not found');
        return this.prisma.digitalProductVariant.update({
            where: { id: BigInt(variantId) },
            data: {
                name: dto.name,
                durationDays: dto.durationDays,
                priceMmk: dto.priceMmk,
                priceUsd: dto.priceUsd,
                badge: dto.badge,
                sortOrder: dto.sortOrder,
                isActive: dto.isActive,
            },
        });
    }
    async deleteVariant(variantId) {
        const variant = await this.prisma.digitalProductVariant.findUnique({
            where: { id: BigInt(variantId) },
        });
        if (!variant)
            throw new common_1.NotFoundException('Variant not found');
        return this.prisma.digitalProductVariant.delete({
            where: { id: BigInt(variantId) },
        });
    }
    async addFeature(productId, dto) {
        const product = await this.prisma.digitalProduct.findUnique({
            where: { id: BigInt(productId) },
        });
        if (!product)
            throw new common_1.NotFoundException('Digital product not found');
        return this.prisma.digitalProductFeature.create({
            data: {
                digitalProductId: BigInt(productId),
                name: dto.name,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
    }
    async deleteFeature(featureId) {
        const feature = await this.prisma.digitalProductFeature.findUnique({
            where: { id: BigInt(featureId) },
        });
        if (!feature)
            throw new common_1.NotFoundException('Feature not found');
        return this.prisma.digitalProductFeature.delete({
            where: { id: BigInt(featureId) },
        });
    }
    withStockFlags(product) {
        const available = product.isAvailable;
        return {
            ...product,
            stockAvailable: available,
            inStock: available,
        };
    }
};
exports.GamesService = GamesService;
exports.GamesService = GamesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GamesService);
//# sourceMappingURL=games.service.js.map