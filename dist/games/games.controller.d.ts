import { GamesService } from './games.service';
import { CreateDigitalProductDto } from './dto/games.dto';
export declare class GamesController {
    private gamesService;
    constructor(gamesService: GamesService);
    getDigitalProducts(): Promise<any[]>;
    getDigitalProductsAdmin(): Promise<any[]>;
    storeDigitalProduct(dto: CreateDigitalProductDto, image?: Express.Multer.File): Promise<any>;
    updateDigitalProduct(id: string, dto: CreateDigitalProductDto, image?: Express.Multer.File): Promise<any>;
}
