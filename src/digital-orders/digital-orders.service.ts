import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDigitalOrderDto } from './dto/digital-orders.dto';

@Injectable()
export class DigitalOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateDigitalOrderDto) {
    const product = await this.prisma.digitalProduct.findUnique({
      where: { id: BigInt(dto.digitalProductId) },
    });
    if (!product) throw new NotFoundException('Digital product not found');

    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(userId) },
    });
    if (!user) throw new NotFoundException('User not found');

    // Resolve price from variant if provided
    let amount = dto.amountMmk;
    let variantName = dto.variantName || null;

    if (dto.digitalProductVariantId) {
      const variant = await this.prisma.digitalProductVariant.findUnique({
        where: { id: BigInt(dto.digitalProductVariantId) },
      });
      if (!variant) throw new NotFoundException('Variant not found');
      amount = Number(variant.priceMmk);
      variantName = variant.name;
    }

    if (Number(user.walletBalance) < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    const orderId = uuidv4();

    const [order] = await this.prisma.$transaction([
      this.prisma.digitalOrder.create({
        data: {
          id: orderId,
          userId: BigInt(userId),
          digitalProductId: product.id,
          digitalProductVariantId: dto.digitalProductVariantId ? BigInt(dto.digitalProductVariantId) : null,
          productName: dto.productName,
          variantName,
          amountMmk: amount,
          status: 'Pending',
          deliveryContent: product.description || 'Digital product delivery',
        },
      }),
      this.prisma.user.update({
        where: { id: BigInt(userId) },
        data: { walletBalance: { decrement: amount } },
      }),
      this.prisma.walletTransaction.create({
        data: {
          id: uuidv4(),
          userId: BigInt(userId),
          amount: -amount,
          type: 'ORDER_SPEND',
          paymentMethod: 'Wallet',
          phone: '',
          status: 'Success',
        },
      }),
      // Increment sales count
      this.prisma.digitalProduct.update({
        where: { id: product.id },
        data: { salesCount: { increment: 1 } },
      }),
    ]);

    return order;
  }

  async createByProductId(userId: number, productId: string, variantId?: string) {
    const product = await this.prisma.digitalProduct.findUnique({
      where: { id: BigInt(productId) },
    });
    if (!product) throw new NotFoundException('Digital product not found');

    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(userId) },
    });
    if (!user) throw new NotFoundException('User not found');

    let amount = Number(product.priceMmk);
    let variantName: string | null = null;
    let resolvedVariantId: bigint | null = null;

    if (variantId) {
      const variant = await this.prisma.digitalProductVariant.findUnique({
        where: { id: BigInt(variantId) },
      });
      if (!variant) throw new NotFoundException('Variant not found');
      amount = Number(variant.priceMmk);
      variantName = variant.name;
      resolvedVariantId = variant.id;
    }

    if (Number(user.walletBalance) < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    const orderId = uuidv4();

    const [order] = await this.prisma.$transaction([
      this.prisma.digitalOrder.create({
        data: {
          id: orderId,
          userId: BigInt(userId),
          digitalProductId: product.id,
          digitalProductVariantId: resolvedVariantId,
          productName: product.name,
          variantName,
          amountMmk: amount,
          status: 'Pending',
          deliveryContent: product.description || 'Digital product delivery',
        },
      }),
      this.prisma.user.update({
        where: { id: BigInt(userId) },
        data: { walletBalance: { decrement: amount } },
      }),
      this.prisma.walletTransaction.create({
        data: {
          id: uuidv4(),
          userId: BigInt(userId),
          amount: -amount,
          type: 'ORDER_SPEND',
          paymentMethod: 'Wallet',
          phone: '',
          status: 'Success',
        },
      }),
      // Increment sales count
      this.prisma.digitalProduct.update({
        where: { id: product.id },
        data: { salesCount: { increment: 1 } },
      }),
    ]);

    return order;
  }

  async userOrders(userId: number) {
    return this.prisma.digitalOrder.findMany({
      where: { userId: BigInt(userId) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async adminOrders() {
    return this.prisma.digitalOrder.findMany({
      include: {
        user: { select: { id: true, username: true } },
        digitalProduct: { select: { name: true } },
        digitalProductVariant: { select: { name: true, durationDays: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteOrder(orderId: string) {
    const order = await this.prisma.digitalOrder.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Digital order not found');

    return this.prisma.digitalOrder.delete({
      where: { id: orderId },
    });
  }

  async approveOrder(orderId: string) {
    const order = await this.prisma.digitalOrder.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Digital order not found');
    if (order.status !== 'Pending') {
      throw new BadRequestException('Order is not in pending status');
    }

    return this.prisma.digitalOrder.update({
      where: { id: orderId },
      data: { status: 'Success' },
    });
  }

  async rejectOrder(orderId: string) {
    const order = await this.prisma.digitalOrder.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Digital order not found');
    if (order.status !== 'Pending') {
      throw new BadRequestException('Order is not in pending status');
    }

    const refundAmount = Number(order.amountMmk);

    const [updatedOrder] = await this.prisma.$transaction([
      this.prisma.digitalOrder.update({
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
      // Decrement sales count on rejection
      this.prisma.digitalProduct.update({
        where: { id: order.digitalProductId },
        data: { salesCount: { decrement: 1 } },
      }),
    ]);

    return updatedOrder;
  }
}
