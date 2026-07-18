import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitDepositDto, RedeemCouponDto, GenerateCouponDto } from './dto/wallet.dto';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: { walletBalance: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return { balance: Number(user.walletBalance) };
  }

  async userTransactions(userId: number) {
    return this.prisma.walletTransaction.findMany({
      where: { userId: BigInt(userId) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async submitDeposit(userId: number, dto: SubmitDepositDto) {
    return this.prisma.walletTransaction.create({
      data: {
        id: uuidv4(),
        userId: BigInt(userId),
        amount: dto.amount,
        type: 'DEPOSIT',
        paymentMethod: dto.paymentMethod,
        phone: dto.phone,
        transactionId: dto.transactionId,
        screenshotUrl: dto.screenshotUrl,
        status: 'Pending',
      },
    });
  }

  async redeemCoupon(userId: number, dto: RedeemCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: dto.code },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');
    if (coupon.status !== 'Active') {
      throw new BadRequestException('Coupon already redeemed');
    }

    const [updatedCoupon] = await this.prisma.$transaction([
      this.prisma.coupon.update({
        where: { code: dto.code },
        data: {
          status: 'Redeemed',
          redeemedBy: BigInt(userId),
        },
      }),
      this.prisma.user.update({
        where: { id: BigInt(userId) },
        data: { walletBalance: { increment: Number(coupon.amount) } },
      }),
      this.prisma.walletTransaction.create({
        data: {
          id: uuidv4(),
          userId: BigInt(userId),
          amount: Number(coupon.amount),
          type: 'REFERRAL_BONUS',
          paymentMethod: 'Coupon',
          phone: '',
          status: 'Success',
        },
      }),
    ]);

    return updatedCoupon;
  }

  async adminTopupRequests() {
    return this.prisma.walletTransaction.findMany({
      where: { type: 'DEPOSIT', status: 'Pending' },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveDeposit(transactionId: string) {
    const transaction = await this.prisma.walletTransaction.findUnique({
      where: { id: transactionId },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.status !== 'Pending') {
      throw new BadRequestException('Transaction already processed');
    }

    const [updatedTransaction] = await this.prisma.$transaction([
      this.prisma.walletTransaction.update({
        where: { id: transactionId },
        data: { status: 'Success' },
      }),
      this.prisma.user.update({
        where: { id: transaction.userId },
        data: { walletBalance: { increment: Number(transaction.amount) } },
      }),
    ]);

    return updatedTransaction;
  }

  async rejectDeposit(transactionId: string, reason?: string) {
    const transaction = await this.prisma.walletTransaction.findUnique({
      where: { id: transactionId },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.status !== 'Pending') {
      throw new BadRequestException('Transaction already processed');
    }

    return this.prisma.walletTransaction.update({
      where: { id: transactionId },
      data: {
        status: 'Cancelled',
        rejectionReason: reason || null,
      },
    });
  }

  async getCouponsAdmin() {
    return this.prisma.coupon.findMany({
      include: {
        redeemedByUser: {
          select: { username: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateCoupon(dto: GenerateCouponDto) {
    return this.prisma.coupon.create({
      data: {
        code: dto.code,
        amount: dto.amount,
        createdBy: 'admin',
        status: 'Active',
      },
    });
  }
}
