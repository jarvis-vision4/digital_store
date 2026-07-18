import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GamesService } from './games.service';
import { CreateGameDto, UpdateGameDto, CreatePackageDto, UpdatePackageDto, CreateDigitalProductDto } from './dto/games.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { Public } from '../common/decorators/public.decorator';

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
  @Post('admin/games')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new game (admin)' })
  create(@Body() dto: CreateGameDto) {
    return this.gamesService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Put('admin/games/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a game (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateGameDto) {
    return this.gamesService.update(id, dto);
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a digital product (admin)' })
  storeDigitalProduct(@Body() dto: CreateDigitalProductDto) {
    return this.gamesService.storeDigitalProduct(dto);
  }

}
