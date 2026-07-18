import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TelegramService } from './telegram.service';
import { SimulateCommandDto } from './dto/telegram.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Telegram')
@Controller('v1/telegram')
export class TelegramController {
  constructor(private telegramService: TelegramService) {}

  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Telegram bot webhook endpoint' })
  handleWebhook(@Body() body: any) {
    return this.telegramService.handleWebhook(body);
  }

  @Public()
  @Post('simulate')
  @ApiOperation({ summary: 'Simulate a Telegram command for testing' })
  simulateCommand(@Body() dto: SimulateCommandDto) {
    return this.telegramService.simulateCommand(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Get('admin/bot-logs')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get bot diagnostics (admin)' })
  getDiagnostics() {
    return this.telegramService.getDiagnostics();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/bot-logs/clear')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear bot diagnostics (admin)' })
  clearDiagnostics() {
    return this.telegramService.clearDiagnostics();
  }
}
