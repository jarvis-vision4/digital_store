import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../common/enums';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        walletBalance: true,
        referralCode: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserRole(username: string, role: string) {
    const validRole = Object.values(UserRole).includes(role as UserRole);
    if (!validRole) {
      throw new BadRequestException('Invalid role. Must be ADMIN, MODERATOR, or CUSTOMER');
    }

    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { username },
      data: { role: role as UserRole },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });
  }

  async getReferrals() {
    return this.prisma.referral.findMany({
      include: {
        referrer: {
          select: { id: true, username: true },
        },
        referee: {
          select: { id: true, username: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async rewardReferral(referralId: string) {
    const referral = await this.prisma.referral.findUnique({
      where: { id: BigInt(referralId) },
    });
    if (!referral) throw new NotFoundException('Referral not found');
    if (referral.status !== 'Pending') {
      throw new BadRequestException('Referral already rewarded');
    }

    const bonusAmount = Number(referral.bonusAmountMmk);

    const transaction = await this.prisma.walletTransaction.findFirst({
      where: {
        userId: referral.referrerId,
        type: 'REFERRAL_BONUS',
        status: 'Pending',
        amount: bonusAmount,
      },
    });
    if (!transaction) {
      throw new NotFoundException('Referral wallet transaction not found');
    }

    await this.prisma.$transaction([
      this.prisma.referral.update({
        where: { id: BigInt(referralId) },
        data: { status: 'Rewarded' },
      }),
      this.prisma.walletTransaction.update({
        where: { id: transaction.id },
        data: { status: 'Success' },
      }),
      this.prisma.user.update({
        where: { id: referral.referrerId },
        data: { walletBalance: { increment: bonusAmount } },
      }),
    ]);

    return { message: 'Referral rewarded successfully' };
  }
}
