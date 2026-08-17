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

    // Handle variants: update in place by id, create new ones, soft-disable removed
    if (variants) {
      await this.syncVariants(id, variants);
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

  private async syncVariants(productId: string, variants: NonNullable<CreateDigitalProductDto['variants']>) {
    const productBigInt = BigInt(productId);
    const existingVariants = await this.prisma.digitalProductVariant.findMany({
      where: { digitalProductId: productBigInt },
    });

    const incomingIds = new Set<string>();
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
      } else {
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

    // Removed variants: try delete, fall back to soft-disable when referenced by orders
    for (const ev of existingVariants) {
      if (incomingIds.has(String(ev.id))) continue;
      try {
        await this.prisma.digitalProductVariant.delete({ where: { id: ev.id } });
      } catch {
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

  async deleteDigitalProduct(id: string) {
    const product = await this.prisma.digitalProduct.findUnique({
      where: { id: BigInt(id) },
    });
    if (!product) throw new NotFoundException('Digital product not found');

    const orderCount = await this.prisma.digitalOrder.count({
      where: { digitalProductId: BigInt(id) },
    });

    // If orders reference this product, soft-delete instead of hard delete
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
