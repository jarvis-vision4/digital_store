import { PrismaService } from '../prisma/prisma.service';
import { CreateDigitalProductDto } from './dto/games.dto';
export declare class GamesService {
    private prisma;
    constructor(prisma: PrismaService);
    getDigitalProducts(): Promise<any[]>;
    storeDigitalProduct(dto: CreateDigitalProductDto, imagePath?: string): Promise<any>;
    updateDigitalProduct(id: string, dto: CreateDigitalProductDto, imagePath?: string): Promise<any>;
    getDigitalProductsAdmin(): Promise<any[]>;
    private withStockFlags;
}
