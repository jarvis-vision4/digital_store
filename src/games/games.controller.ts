import { Controller, Get, Post, Put, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GamesService } from './games.service';
import { CreateDigitalProductDto } from './dto/games.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { Public } from '../common/decorators/public.decorator';
import { productStorage, imageFilter, toPublicPath } from '../common/multer.config';

@ApiTags('Digital Products')
@Controller('v1')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Public()
  @Get('digital-products')
  @ApiOperation({ summary: 'Browse all active digital products' })
  getDigitalProducts() {
    return this.gamesService.getDigitalProducts();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Get('admin/digital-products')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all digital products with key counts (admin)' })
  getDigitalProductsAdmin() {
    return this.gamesService.getDigitalProductsAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/digital-products')
  @UseInterceptors(FileInterceptor('image', { storage: productStorage, fileFilter: imageFilter }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a digital product (admin) - optional image file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        category: { type: 'string' },
        description: { type: 'string' },
        priceMmk: { type: 'number' },
        isAvailable: { type: 'boolean', description: 'Manual availability flag (default true)' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  storeDigitalProduct(
    @Body() dto: CreateDigitalProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imagePath = toPublicPath(image?.path);
    return this.gamesService.storeDigitalProduct(dto, imagePath);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Put('admin/digital-products/:id')
  @UseInterceptors(FileInterceptor('image', { storage: productStorage, fileFilter: imageFilter }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a digital product (admin) - optional image file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        category: { type: 'string' },
        description: { type: 'string' },
        priceMmk: { type: 'number' },
        isAvailable: { type: 'boolean', description: 'Manual availability flag (default true)' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  updateDigitalProduct(
    @Param('id') id: string,
    @Body() dto: CreateDigitalProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imagePath = toPublicPath(image?.path);
    return this.gamesService.updateDigitalProduct(id, dto, imagePath);
  }
}
