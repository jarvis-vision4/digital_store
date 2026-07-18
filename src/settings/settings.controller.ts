import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdatePaymentSettingsDto, UpdateSecuritySettingsDto, UpdateNoticeDto, UpdateTelegramBotDto, CreateBannerDto, UpdateBannerDto } from './dto/settings.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Settings')
@Controller('v1')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Public()
  @Get('banners')
  @ApiOperation({ summary: 'Get active promotional banners' })
  getActiveBanners() {
    return this.settingsService.getActiveBanners();
  }

  @Public()
  @Get('notice')
  @ApiOperation({ summary: 'Get global scrolling notice' })
  getGlobalNotice() {
    return this.settingsService.getGlobalNotice();
  }

  @Public()
  @Get('support')
  @ApiOperation({ summary: 'Get support contact channels' })
  getSupportContacts() {
    return this.settingsService.getSupportContacts();
  }

  @Public()
  @Get('settings/payment')
  @ApiOperation({ summary: 'Get payment account details' })
  getPaymentSettings() {
    return this.settingsService.getPaymentSettings();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Get('admin/settings')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all system settings (admin)' })
  index() {
    return this.settingsService.index();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Put('admin/settings/payment')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update payment gateway settings (admin)' })
  updatePaymentSettings(@Body() dto: UpdatePaymentSettingsDto) {
    return this.settingsService.updatePaymentSettings(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Put('admin/settings/security')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update security settings (admin)' })
  updateSecuritySettings(@Body() dto: UpdateSecuritySettingsDto) {
    return this.settingsService.updateSecuritySettings(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Put('admin/settings/notice')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update global notice (admin)' })
  updateNotice(@Body() dto: UpdateNoticeDto) {
    return this.settingsService.updateNotice(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Put('admin/settings/telegram-bot')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Telegram bot settings (admin)' })
  updateTelegramBot(@Body() dto: UpdateTelegramBotDto) {
    return this.settingsService.updateTelegramBot(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Get('admin/banners')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all banners with inactive (admin)' })
  getBannersAdmin() {
    return this.settingsService.getBannersAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/banners')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a promotional banner (admin)' })
  storeBanner(@Body() dto: CreateBannerDto) {
    return this.settingsService.storeBanner(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Put('admin/banners/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a banner (admin)' })
  updateBanner(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.settingsService.updateBanner(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Get('admin/statistics')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  getAdminStats() {
    return this.settingsService.getAdminStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Get('admin/audit-logs')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin audit logs' })
  getAuditLogs() {
    return this.settingsService.getAuditLogs();
  }
}
