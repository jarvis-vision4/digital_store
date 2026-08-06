import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { GamesService } from './games.service';
import { CreateGameDto, UpdateGameDto, CreatePackageDto, UpdatePackageDto, CreateDigitalProductDto } from './dto/games.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { Public } from '../common/decorators/public.decorator';
import { gamesStorage, productStorage, imageFilter, toPublicPath } from '../common/multer.config';

@ApiTags('Games')
@Controller('v1')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Public()
  @Get('games')
  @ApiOperation({ summary: 'Browse all active games with packages' })
  findAll() {
    return this.gamesService.findAll();
  }

  @Public()
  @Get('games/:id')
  @ApiOperation({ summary: 'Get game details with packages' })
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/games/upload')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ], { storage: gamesStorage, fileFilter: imageFilter }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a game image and return its URL (admin)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary', description: 'Game image (either image or file field)' },
        file: { type: 'string', format: 'binary', description: 'Game image (either image or file field)' },
      },
    },
  })
  upload(
    @UploadedFiles() files?: { image?: Express.Multer.File[]; file?: Express.Multer.File[] },
  ) {
    const image = files?.image?.[0] ?? files?.file?.[0];
    if (!image) {
      throw new BadRequestException('image or file field is required');
    }
    return { url: toPublicPath(image.path) };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/games')
  @UseInterceptors(FileInterceptor('image', { storage: gamesStorage, fileFilter: imageFilter }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new game (admin) - upload an image file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        category: { type: 'string' },
        image: { type: 'string', format: 'binary' },
        posterUrl: { type: 'string' },
        description: { type: 'string' },
        minAmount: { type: 'string' },
        popular: { type: 'boolean' },
        sortOrder: { type: 'number' },
        packages: { type: 'string', description: 'JSON string array of packages, e.g. [{"packageName":"100 Diamonds","priceMmk":1000}]' },
      },
    },
  })
  create(
    @Body() body: any,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const dto: CreateGameDto = {
      ...body,
      packages:
        typeof body.packages === 'string' ? JSON.parse(body.packages) : body.packages,
    };
    const imagePath = toPublicPath(image?.path);
    return this.gamesService.create(dto, imagePath);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Put('admin/games/:id')
  @UseInterceptors(FileInterceptor('image', { storage: gamesStorage, fileFilter: imageFilter }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a game (admin) - optional image file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        category: { type: 'string' },
        image: { type: 'string', format: 'binary' },
        posterUrl: { type: 'string' },
        description: { type: 'string' },
        minAmount: { type: 'string' },
        popular: { type: 'boolean' },
        isActive: { type: 'boolean' },
        sortOrder: { type: 'number' },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateGameDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imagePath = toPublicPath(image?.path);
    return this.gamesService.update(id, dto, imagePath);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Delete('admin/games/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a game (admin)' })
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/games/:id/packages')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a package to a game (admin)' })
  addPackage(@Param('id') id: string, @Body() dto: CreatePackageDto) {
    return this.gamesService.addPackage(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Put('admin/packages/:package_id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a game package (admin)' })
  updatePackage(@Param('package_id') packageId: string, @Body() dto: UpdatePackageDto) {
    return this.gamesService.updatePackage(packageId, dto);
  }

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
