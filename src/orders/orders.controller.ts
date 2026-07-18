import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, RateOrderDto } from './dto/orders.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Orders')
@Controller('v1')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Public()
  @Get('reviews')
  @ApiOperation({ summary: 'Get public customer reviews' })
  getPublicReviews() {
    return this.ordersService.getPublicReviews();
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user order history' })
  userOrders(@CurrentUser('id') userId: number) {
    return this.ordersService.userOrders(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order (deducts from wallet)' })
  create(@CurrentUser('id') userId: number, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('orders/:id/rate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rate and review a completed order' })
  rateOrder(
    @CurrentUser('id') userId: number,
    @Param('id') orderId: string,
    @Body() dto: RateOrderDto,
  ) {
    return this.ordersService.rateOrder(userId, orderId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Get('admin/orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all orders (admin)' })
  adminOrders() {
    return this.ordersService.adminOrders();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/orders/:id/deliver')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deliver a pending order (admin)' })
  deliverOrder(@Param('id') orderId: string) {
    return this.ordersService.deliverOrder(orderId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/orders/:id/cancel')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an order and refund wallet (admin)' })
  cancelOrder(@Param('id') orderId: string) {
    return this.ordersService.cancelOrder(orderId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Delete('admin/orders/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an order permanently (admin)' })
  deleteOrder(@Param('id') orderId: string) {
    return this.ordersService.deleteOrder(orderId);
  }
}
