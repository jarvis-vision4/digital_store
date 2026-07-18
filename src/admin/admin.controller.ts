import { Controller, Get, Put, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Admin')
@Controller('v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MODERATOR)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all users (admin)' })
  getUsers() {
    return this.adminService.getUsers();
  }

  @Put('users/:username/role')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user role (admin)' })
  updateUserRole(@Param('username') username: string, @Body('role') role: string) {
    return this.adminService.updateUserRole(username, role);
  }

  @Get('referrals')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all referrals (admin)' })
  getReferrals() {
    return this.adminService.getReferrals();
  }

  @Post('referrals/:id/reward')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reward a pending referral (admin)' })
  rewardReferral(@Param('id') id: string) {
    return this.adminService.rewardReferral(id);
  }
}
