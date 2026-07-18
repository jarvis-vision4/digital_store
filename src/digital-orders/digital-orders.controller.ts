import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DigitalOrdersService } from './digital-orders.service';
import { CreateDigitalOrderDto } from './dto/digital-orders.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { CurrentUser } from '../common/decorators/current-user.decorator';
@ApiTags('Digital Orders')
@Controller('v1')
export class DigitalOrdersController {
  constructor(private digitalOrdersService: DigitalOrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('digital-orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Purchase a digital product (auto-delivered)' })
  create(@CurrentUser('id') userId: number, @Body() dto: CreateDigitalOrderDto) {
    return this.digitalOrdersService.create(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('digital-products/:id/order')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Purchase a digital product by product ID' })
  createByProductId(@CurrentUser('id') userId: number, @Param('id') productId: string) {
    return this.digitalOrdersService.createByProductId(userId, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('digital-orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user digital order history' })
  userOrders(@CurrentUser('id') userId: number) {
    return this.digitalOrdersService.userOrders(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Get('admin/digital-orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all digital orders (admin)' })
  adminOrders() {
    return this.digitalOrdersService.adminOrders();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Delete('admin/digital-orders/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a digital order (admin)' })
  deleteOrder(@Param('id') orderId: string) {
    return this.digitalOrdersService.deleteOrder(orderId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/digital-orders/:id/approve')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a pending digital order (admin)' })
  approveOrder(@Param('id') orderId: string) {
    return this.digitalOrdersService.approveOrder(orderId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/digital-orders/:id/reject')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a pending digital order and refund (admin)' })
  rejectOrder(@Param('id') orderId: string) {
    return this.digitalOrdersService.rejectOrder(orderId);
  }
}
