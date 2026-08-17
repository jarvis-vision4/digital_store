import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
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

  // ── Public ──────────────────────────────────────────

  @Public()
  @Get('digital-products')
  @ApiOperation({ summary: 'Browse all active digital products' })
  getDigitalProducts() {
    return this.gamesService.getDigitalProducts();
  }

  @Public()
  @Get('digital-products/:id')
  @ApiOperation({ summary: 'Get a single digital product with variants and features' })
  getDigitalProductById(@Param('id') id: string) {
    return this.gamesService.getDigitalProductById(id);
  }

  // ── Admin: Products ─────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Get('admin/digital-products')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all digital products (admin)' })
  getDigitalProductsAdmin() {
    return this.gamesService.getDigitalProductsAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/digital-products')
  @UseInterceptors(FileInterceptor('image', { storage: productStorage, fileFilter: imageFilter }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a digital product with optional variants and features' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        category: { type: 'string' },
        description: { type: 'string' },
        priceMmk: { type: 'number' },
        rating: { type: 'number' },
        badge: { type: 'string', description: 'e.g. HOT, NEW' },
        isAvailable: { type: 'boolean' },
        image: { type: 'string', format: 'binary' },
        variants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: '1 Month Pro' },
              durationDays: { type: 'number', example: 30 },
              priceMmk: { type: 'number', example: 8500 },
              priceUsd: { type: 'number', example: 1.5 },
              badge: { type: 'string', example: 'HOT' },
              sortOrder: { type: 'number' },
            },
          },
        },
        features: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'All Pro Filters & Effects' },
              sortOrder: { type: 'number' },
            },
          },
        },
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
  @ApiOperation({ summary: 'Update a digital product (replaces variants/features if provided)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        category: { type: 'string' },
        description: { type: 'string' },
        priceMmk: { type: 'number' },
        rating: { type: 'number' },
        badge: { type: 'string' },
        isAvailable: { type: 'boolean' },
        image: { type: 'string', format: 'binary' },
        variants: { type: 'array', items: { type: 'object' } },
        features: { type: 'array', items: { type: 'object' } },
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

  // ── Admin: Variant management ───────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/digital-products/:id/variants')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a variant to a digital product' })
  addVariant(@Param('id') id: string, @Body() dto: any) {
    return this.gamesService.addVariant(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Put('admin/digital-product-variants/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a variant' })
  updateVariant(@Param('id') id: string, @Body() dto: any) {
    return this.gamesService.updateVariant(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Delete('admin/digital-product-variants/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a variant' })
  deleteVariant(@Param('id') id: string) {
    return this.gamesService.deleteVariant(id);
  }

  // ── Admin: Feature management ───────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/digital-products/:id/features')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a feature to a digital product' })
  addFeature(@Param('id') id: string, @Body() dto: { name: string; sortOrder?: number }) {
    return this.gamesService.addFeature(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Delete('admin/digital-product-features/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a feature' })
  deleteFeature(@Param('id') id: string) {
    return this.gamesService.deleteFeature(id);
  }
}
