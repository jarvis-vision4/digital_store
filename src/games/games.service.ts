import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDigitalProductDto } from './dto/games.dto';

interface VariantInput {
  id?: number;
  name: string;
  durationDays: number;
  priceMmk: number;
  priceUsd?: number | null;
  badge?: string;
  sortOrder?: number;
  isActive?: boolean;
}

interface FeatureInput {
  name: string;
  sortOrder?: number;
}

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  private productInclude = {
    variants: { orderBy: { sortOrder: 'asc' as const } },
    features: { orderBy: { sortOrder: 'asc' as const } },
  };

  /** Accepts an array or a JSON string (multipart form fields arrive as strings). */
  private parseArrayInput(input: unknown): any[] {
    if (input === undefined || input === null) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        throw new BadRequestException('Invalid JSON array for variants/features');
      }
    }
    return [];
  }

  private toNumber(value: unknown): number | undefined {
    if (value === undefined || value === null || value === '') return undefined;
    const n = Number(value);
    return Number.isNaN(n) ? undefined : n;
  }

  private toBoolean(value: unknown): boolean | undefined {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'boolean') return value;
    return value === 'true' || value === '1' || value === 1;
  }

  private normalizeVariant(raw: unknown, index: number): VariantInput {
    const v = (raw ?? {}) as Record<string, unknown>;
    const name = typeof v.name === 'string' ? v.name : undefined;
    const durationDays = this.toNumber(v.durationDays);
    const priceMmk = this.toNumber(v.priceMmk);

    if (!name) {
      throw new BadRequestException(`Variant #${index + 1} is missing required field "name"`);
    }
    if (durationDays === undefined) {
      throw new BadRequestException(`Variant "${name}" is missing required field "durationDays"`);
    }
    if (priceMmk === undefined) {
      throw new BadRequestException(`Variant "${name}" is missing required field "priceMmk"`);
    }

    return {
      id: this.toNumber(v.id),
      name,
      durationDays: durationDays!,
      priceMmk: priceMmk!,
      priceUsd: this.toNumber(v.priceUsd) ?? null,
      badge: typeof v.badge === 'string' ? v.badge : undefined,
      sortOrder: this.toNumber(v.sortOrder),
      isActive: this.toBoolean(v.isActive),
    };
  }

  private normalizeFeature(raw: unknown, index: number): FeatureInput {
    const f = (raw ?? {}) as Record<string, unknown>;
    const name = typeof f.name === 'string' ? f.name : undefined;
    if (!name) {
      throw new BadRequestException(`Feature #${index + 1} is missing required field "name"`);
    }
    return {
      name,
      sortOrder: this.toNumber(f.sortOrder),
    };
  }

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
    const { variants: rawVariants, features: rawFeatures, ...productData } = dto;

    const variants = this.parseArrayInput(rawVariants).map((v, i) => this.normalizeVariant(v, i));
    const features = this.parseArrayInput(rawFeatures).map((f, i) => this.normalizeFeature(f, i));

    const product = await this.prisma.digitalProduct.create({
      data: {
        ...productData,
        ...(imagePath ? { image: imagePath } : {}),
        ...(variants.length
          ? {
              variants: {
                create: variants.map((v, i) => ({
                  name: v.name!,
                  durationDays: v.durationDays!,
                  priceMmk: v.priceMmk!,
                  priceUsd: v.priceUsd ?? null,
                  badge: v.badge ?? null,
                  sortOrder: v.sortOrder ?? i,
                  isActive: v.isActive ?? true,
                })),
              },
            }
          : {}),
        ...(features.length
          ? {
              features: {
                create: features.map((f, i) => ({
                  name: f.name!,
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

    const { variants: rawVariants, features: rawFeatures, ...productData } = dto;

    const updateData: any = {
      ...productData,
      ...(imagePath ? { image: imagePath } : {}),
    };

    // Handle variants: update in place by id, create new ones, soft-disable removed
    if (rawVariants !== undefined) {
      const variants = this.parseArrayInput(rawVariants).map((v, i) => this.normalizeVariant(v, i));
      await this.syncVariants(id, variants);
    }

    // Handle features: delete existing and recreate
    if (rawFeatures !== undefined) {
      const features = this.parseArrayInput(rawFeatures).map((f, i) => this.normalizeFeature(f, i));
      await this.prisma.digitalProductFeature.deleteMany({
        where: { digitalProductId: BigInt(id) },
      });
      if (features.length > 0) {
        updateData.features = {
          create: features.map((f, i) => ({
            name: f.name!,
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

  private async syncVariants(productId: string, variants: VariantInput[]) {
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
            name: v.name!,
            durationDays: v.durationDays!,
            priceMmk: v.priceMmk!,
            priceUsd: v.priceUsd ?? null,
            badge: v.badge ?? null,
            sortOrder: v.sortOrder ?? 0,
            isActive: v.isActive ?? true,
          },
        });
      } else {
        await this.prisma.digitalProductVariant.create({
          data: {
            digitalProductId: productBigInt,
            name: v.name!,
            durationDays: v.durationDays!,
            priceMmk: v.priceMmk!,
            priceUsd: v.priceUsd ?? null,
            badge: v.badge ?? null,
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

    const v = this.normalizeVariant(dto, 0);

    return this.prisma.digitalProductVariant.create({
      data: {
        digitalProductId: BigInt(productId),
        name: v.name!,
        durationDays: v.durationDays!,
        priceMmk: v.priceMmk!,
        priceUsd: v.priceUsd ?? null,
        badge: v.badge ?? null,
        sortOrder: v.sortOrder ?? 0,
        isActive: v.isActive ?? true,
      },
    });
  }

  async updateVariant(variantId: string, dto: any) {
    const variant = await this.prisma.digitalProductVariant.findUnique({
      where: { id: BigInt(variantId) },
    });
    if (!variant) throw new NotFoundException('Variant not found');

    const v = this.normalizeVariant(dto, 0);

    return this.prisma.digitalProductVariant.update({
      where: { id: BigInt(variantId) },
      data: {
        name: v.name!,
        durationDays: v.durationDays!,
        priceMmk: v.priceMmk!,
        priceUsd: v.priceUsd ?? null,
        badge: v.badge ?? null,
        sortOrder: v.sortOrder ?? 0,
        isActive: v.isActive ?? true,
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
  async addFeature(productId: string, dto: any) {
    const product = await this.prisma.digitalProduct.findUnique({
      where: { id: BigInt(productId) },
    });
    if (!product) throw new NotFoundException('Digital product not found');

    const f = this.normalizeFeature(dto, 0);

    return this.prisma.digitalProductFeature.create({
      data: {
        digitalProductId: BigInt(productId),
        name: f.name!,
        sortOrder: f.sortOrder ?? 0,
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
