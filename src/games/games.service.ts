import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto, UpdateGameDto, CreatePackageDto, UpdatePackageDto, CreateDigitalProductDto } from './dto/games.dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.game.findMany({
      where: { isActive: true },
      include: {
        packages: {
          where: { isActive: true },
          orderBy: { priceMmk: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const game = await this.prisma.game.findUnique({
      where: { id },
      include: {
        packages: {
          where: { isActive: true },
          orderBy: { priceMmk: 'asc' },
        },
      },
    });
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  async create(dto: CreateGameDto) {
    const { packages, ...gameData } = dto;
    return this.prisma.game.create({
      data: {
        ...gameData,
        packages: {
          createMany: {
            data: packages,
          },
        },
      },
      include: { packages: true },
    });
  }

  async update(id: string, dto: UpdateGameDto) {
    const game = await this.prisma.game.findUnique({ where: { id } });
    if (!game) throw new NotFoundException('Game not found');
    return this.prisma.game.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const game = await this.prisma.game.findUnique({ where: { id } });
    if (!game) throw new NotFoundException('Game not found');
    return this.prisma.game.delete({ where: { id } });
  }

  async addPackage(gameId: string, dto: CreatePackageDto) {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new NotFoundException('Game not found');
    return this.prisma.gamePackage.create({
      data: {
        gameId,
        packageName: dto.packageName,
        priceMmk: dto.priceMmk,
        stockQuantity: dto.stockQuantity ?? 9999,
        originalPrice: dto.originalPrice,
      },
    });
  }

  async updatePackage(packageId: string, dto: UpdatePackageDto) {
    const pkg = await this.prisma.gamePackage.findUnique({
      where: { id: BigInt(packageId) },
    });
    if (!pkg) throw new NotFoundException('Package not found');
    return this.prisma.gamePackage.update({
      where: { id: BigInt(packageId) },
      data: dto,
    });
  }

  // Digital Products
  async getDigitalProducts() {
    return this.prisma.digitalProduct.findMany({
      where: { isActive: true },
    });
  }

  async storeDigitalProduct(dto: CreateDigitalProductDto) {
    return this.prisma.digitalProduct.create({ data: dto });
  }

  async getDigitalProductsAdmin() {
    return this.prisma.digitalProduct.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
