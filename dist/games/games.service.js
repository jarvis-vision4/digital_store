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
    async getDigitalProducts() {
        const products = await this.prisma.digitalProduct.findMany({
            where: { isActive: true },
        });
        return products.map((p) => this.withStockFlags(p));
    }
    async storeDigitalProduct(dto, imagePath) {
        const product = await this.prisma.digitalProduct.create({
            data: {
                ...dto,
                ...(imagePath ? { image: imagePath } : {}),
            },
        });
        return this.withStockFlags(product);
    }
    async updateDigitalProduct(id, dto, imagePath) {
        const product = await this.prisma.digitalProduct.findUnique({
            where: { id: BigInt(id) },
        });
        if (!product)
            throw new common_1.NotFoundException('Digital product not found');
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