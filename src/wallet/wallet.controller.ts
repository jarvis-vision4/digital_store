import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { SubmitDepositDto, RedeemCouponDto, GenerateCouponDto } from './dto/wallet.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Wallet')
@Controller('v1')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Get('wallet/balance')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current wallet balance' })
  getBalance(@CurrentUser('id') userId: number) {
    return this.walletService.getBalance(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('wallet/transactions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get wallet transaction history' })
  userTransactions(@CurrentUser('id') userId: number) {
    return this.walletService.userTransactions(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('wallet/deposit')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a manual deposit request with screenshot' })
  submitDeposit(@CurrentUser('id') userId: number, @Body() dto: SubmitDepositDto) {
    return this.walletService.submitDeposit(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('coupons/redeem')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Redeem a coupon/gift code' })
  redeemCoupon(@CurrentUser('id') userId: number, @Body() dto: RedeemCouponDto) {
    return this.walletService.redeemCoupon(userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Get('admin/topups')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List pending deposit requests (admin)' })
  adminTopupRequests() {
    return this.walletService.adminTopupRequests();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/topups/:id/approve')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a deposit and credit wallet (admin)' })
  approveDeposit(@Param('id') transactionId: string) {
    return this.walletService.approveDeposit(transactionId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/topups/:id/reject')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a deposit request (admin)' })
  rejectDeposit(@Param('id') transactionId: string, @Query('reason') reason?: string) {
    return this.walletService.rejectDeposit(transactionId, reason);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Get('admin/coupons')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all coupons (admin)' })
  getCouponsAdmin() {
    return this.walletService.getCouponsAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/coupons')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate a new coupon (admin)' })
  generateCoupon(@Body() dto: GenerateCouponDto) {
    return this.walletService.generateCoupon(dto);
  }
}
