import { Injectable, ConflictException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, ChangePasswordDto, OAuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: dto.username },
          ...(dto.email ? [{ email: dto.email }] : []),
        ],
      },
    });
    if (existing) {
      throw new ConflictException('Username or email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const referralCode = uuidv4().slice(0, 8).toUpperCase();

    let referredByUser: { id: bigint; referralCode: string; discountRate: any } | null = null;
    if (dto.referralCode) {
      referredByUser = await this.prisma.user.findUnique({
        where: { referralCode: dto.referralCode },
      });
      if (!referredByUser) {
        throw new BadRequestException('Invalid referral code');
      }
    }

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        passwordHash,
        referralCode,
        referredBy: dto.referralCode || null,
      },
    });

    if (referredByUser) {
      await this.prisma.$transaction([
        this.prisma.referral.create({
          data: {
            referrerId: referredByUser.id,
            refereeId: user.id,
            bonusAmountMmk: 500,
            status: 'Rewarded',
          },
        }),
        this.prisma.walletTransaction.create({
          data: {
            id: uuidv4(),
            userId: referredByUser.id,
            amount: 500,
            type: 'REFERRAL_BONUS',
            paymentMethod: 'Referral',
            phone: '',
            status: 'Success',
          },
        }),
        this.prisma.user.update({
          where: { id: referredByUser.id },
          data: { walletBalance: { increment: 500 } },
        }),
      ]);
    }

    return this.generateToken(user);
  }

  async login(dto: LoginDto) {
    if (!dto.email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  /**
   * OAuth (Google) sign-in / upsert.
   * - If a user with the given email exists, we simply log them in
   *   (first Google sign-in for an existing email-password account links it).
   * - Otherwise we create a new user in the `users` table:
   *     username      -> from the OAuth profile (email prefix, made unique)
   *     email         -> verified Google email
   *     passwordHash  -> random bcrypt hash (OAuth users cannot log in by password)
   *     referralCode  -> generated like a normal registration
   * Returns the same { accessToken, user } shape as register/login so the
   * frontend can drop it into the existing JWT / axios flow.
   */
  async oauthLogin(dto: OAuthDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      return this.generateToken(existing);
    }

    // Ensure a unique username if the email prefix is already taken.
    let username = dto.username;
    const taken = await this.prisma.user.findUnique({
      where: { username },
    });
    if (taken) {
      username = `${dto.username}_${uuidv4().slice(0, 6)}`;
    }

    const passwordHash = await bcrypt.hash(uuidv4(), 10);
    const referralCode = uuidv4().slice(0, 8).toUpperCase();

    const user = await this.prisma.user.create({
      data: {
        username,
        email: dto.email,
        passwordHash,
        referralCode,
      },
    });

    return this.generateToken(user);
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: {
        id: true,
        username: true,
        email: true,
        walletBalance: true,
        referralCode: true,
        referredBy: true,
        vipLevel: true,
        vipName: true,
        discountRate: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return { ...user, walletBalance: Number(user.walletBalance) };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(userId) },
    });
    if (!user) throw new UnauthorizedException();

    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: BigInt(userId) },
      data: { passwordHash },
    });
    return { message: 'Password changed successfully' };
  }

  async getReferralInfo(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: { referralCode: true },
    });

    const referrals = await this.prisma.referral.findMany({
      where: { referrerId: BigInt(userId) },
      include: {
        referee: {
          select: { username: true, createdAt: true },
        },
      },
    });

    const totalReferrals = referrals.length;
    const totalBonus = referrals.reduce(
      (sum, r) => sum + Number(r.bonusAmountMmk),
      0,
    );

    return {
      referralCode: user?.referralCode,
      totalReferrals,
      totalBonus,
      referrals,
    };
  }

  private async generateToken(user: { id: bigint; username: string; role: string }) {
    const payload = {
      sub: String(user.id),
      username: user.username,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: Number(user.id),
        username: user.username,
        role: user.role,
      },
    };
  }
}
