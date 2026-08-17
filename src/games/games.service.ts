import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDigitalProductDto } from './dto/games.dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  private productInclude = {
    variants: { orderBy: { sortOrder: 'asc' as const } },
    features: { orderBy: { sortOrder: 'asc' as const } },
  };

  async getDigitalProducts() {
    const products = await this.prisma.digitalProduct.findMany({
      where: { isActive: true },
      include: this.productInclude,
    });
    return products.map((p) => this.withStockFlags(p));
  }

  async getDigitalProductById(id: string) {
    const product = await this.prisma.digitalProduct.findUnique({
      where: { id: BigInt(id) },
      include: this.productInclude,
    });
    if (!product) throw new NotFoundException('Digital product not found');
    return this.withStockFlags(product);
  }

  async storeDigitalProduct(dto: CreateDigitalProductDto, imagePath?: string) {
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

  async updateDigitalProduct(id: string, dto: CreateDigitalProductDto, imagePath?: string) {
    const existing = await this.prisma.digitalProduct.findUnique({
      where: { id: BigInt(id) },
    });
    if (!existing) throw new NotFoundException('Digital product not found');

    const { variants, features, ...productData } = dto;

    const updateData: any = {
      ...productData,
      ...(imagePath ? { image: imagePath } : {}),
    };

    // Handle variants: delete existing and recreate
    if (variants) {
      await this.prisma.digitalProductVariant.deleteMany({
        where: { digitalProductId: BigInt(id) },
      });
      if (variants.length > 0) {
        updateData.variants = {
          create: variants.map((v, i) => ({
            ...v,
            sortOrder: v.sortOrder ?? i,
          })),
        };
      }
    }

    // Handle features: delete existing and recreate
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

  async getDigitalProductsAdmin() {
    const products = await this.prisma.digitalProduct.findMany({
      include: this.productInclude,
      orderBy: { createdAt: 'desc' },
    });
    return products.map((p) => this.withStockFlags(p));
  }

  // Variant CRUD
  async addVariant(productId: string, dto: any) {
    const product = await this.prisma.digitalProduct.findUnique({
      where: { id: BigInt(productId) },
    });
    if (!product) throw new NotFoundException('Digital product not found');

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

  async updateVariant(variantId: string, dto: any) {
    const variant = await this.prisma.digitalProductVariant.findUnique({
      where: { id: BigInt(variantId) },
    });
    if (!variant) throw new NotFoundException('Variant not found');

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

  async deleteVariant(variantId: string) {
    const variant = await this.prisma.digitalProductVariant.findUnique({
      where: { id: BigInt(variantId) },
    });
    if (!variant) throw new NotFoundException('Variant not found');

    return this.prisma.digitalProductVariant.delete({
      where: { id: BigInt(variantId) },
    });
  }

  // Feature CRUD
  async addFeature(productId: string, dto: { name: string; sortOrder?: number }) {
    const product = await this.prisma.digitalProduct.findUnique({
      where: { id: BigInt(productId) },
    });
    if (!product) throw new NotFoundException('Digital product not found');

    return this.prisma.digitalProductFeature.create({
      data: {
        digitalProductId: BigInt(productId),
        name: dto.name,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async deleteFeature(featureId: string) {
    const feature = await this.prisma.digitalProductFeature.findUnique({
      where: { id: BigInt(featureId) },
    });
    if (!feature) throw new NotFoundException('Feature not found');

    return this.prisma.digitalProductFeature.delete({
      where: { id: BigInt(featureId) },
    });
  }

  private withStockFlags(product: any) {
    const available = product.isAvailable;
    return {
      ...product,
      stockAvailable: available,
      inStock: available,
    };
  }
}
