import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, RateOrderDto } from './dto/orders.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateOrderDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(userId) },
    });
    if (!user) throw new NotFoundException('User not found');

    const discountRate = Number(user.discountRate);
    const finalAmount = dto.amountMmk * (1 - discountRate);

    if (Number(user.walletBalance) < finalAmount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    const orderId = uuidv4();

    const [order] = await this.prisma.$transaction([
      this.prisma.order.create({
        data: {
          id: orderId,
          userId: BigInt(userId),
          gameId: dto.gameId,
          gameName: dto.gameName,
          packageName: dto.packageName,
          amountMmk: finalAmount,
          playerId: dto.playerId,
          zoneId: dto.zoneId,
          status: 'Pending',
        },
      }),
      this.prisma.user.update({
        where: { id: BigInt(userId) },
        data: { walletBalance: { decrement: finalAmount } },
      }),
      this.prisma.walletTransaction.create({
        data: {
          id: uuidv4(),
          userId: BigInt(userId),
          amount: -finalAmount,
          type: 'ORDER_SPEND',
          paymentMethod: 'Wallet',
          phone: '',
          status: 'Success',
        },
      }),
    ]);

    return order;
  }

  async userOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId: BigInt(userId) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async rateOrder(userId: number, orderId: string, dto: RateOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (Number(order.userId) !== userId) {
      throw new BadRequestException('This order does not belong to you');
    }
    if (order.status !== 'Success') {
      throw new BadRequestException('Can only rate completed orders');
    }
    if (order.rating != null) {
      throw new BadRequestException('Order already rated');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        rating: dto.rating,
        reviewText: dto.reviewText,
      },
    });
  }

  async getPublicReviews() {
    return this.prisma.order.findMany({
      where: {
        status: 'Success',
        rating: { not: null },
        reviewText: { not: null },
      },
      select: {
        id: true,
        gameName: true,
        packageName: true,
        rating: true,
        reviewText: true,
        createdAt: true,
        user: {
          select: { username: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async adminOrders() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deliverOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'Pending') {
      throw new BadRequestException('Order is not in pending status');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'Success' },
    });
  }

  async cancelOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'Pending') {
      throw new BadRequestException('Can only cancel pending orders');
    }

    const refundAmount = Number(order.amountMmk);

    const [updatedOrder] = await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'Cancelled' },
      }),
      this.prisma.user.update({
        where: { id: order.userId },
        data: { walletBalance: { increment: refundAmount } },
      }),
      this.prisma.walletTransaction.create({
        data: {
          id: uuidv4(),
          userId: order.userId,
          amount: refundAmount,
          type: 'REFUND',
          paymentMethod: 'Wallet',
          phone: '',
          status: 'Success',
        },
      }),
    ]);

    return updatedOrder;
  }

  async deleteOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.delete({
      where: { id: orderId },
    });
  }
}
