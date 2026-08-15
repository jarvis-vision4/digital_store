import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDigitalProductDto } from './dto/games.dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  // Digital Products
  async getDigitalProducts() {
    const products = await this.prisma.digitalProduct.findMany({
      where: { isActive: true },
    });
    return products.map((p) => this.withStockFlags(p));
  }

  async storeDigitalProduct(dto: CreateDigitalProductDto, imagePath?: string) {
    const product = await this.prisma.digitalProduct.create({
      data: {
        ...dto,
        ...(imagePath ? { image: imagePath } : {}),
      },
    });
    return this.withStockFlags(product);
  }

  async updateDigitalProduct(id: string, dto: CreateDigitalProductDto, imagePath?: string) {
    const product = await this.prisma.digitalProduct.findUnique({
      where: { id: BigInt(id) },
    });
    if (!product) throw new NotFoundException('Digital product not found');
    const updated = await this.prisma.digitalProduct.update({
      where: { id: BigInt(id) },
      data: {
        ...dto,
        ...(imagePath ? { image: imagePath } : {}),
      },
    });
    return this.withStockFlags(updated);
  }

  async getDigitalProductsAdmin() {
    const products = await this.prisma.digitalProduct.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return products.map((p) => this.withStockFlags(p));
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
