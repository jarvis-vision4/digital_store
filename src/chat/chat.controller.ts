import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Chat')
@Controller('v1')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('chat/messages')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user chat history with support' })
  myMessages(@CurrentUser('id') userId: number) {
    return this.chatService.userMessages(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('chat/unread')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unread support messages count for current user' })
  myUnread(@CurrentUser('id') userId: number) {
    return this.chatService.userUnread(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('chat/read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark all support messages as read for current user' })
  markMyRead(@CurrentUser('id') userId: number) {
    return this.chatService.markUserRead(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Get('admin/chat/users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List users with chat history (admin)' })
  adminUsers() {
    return this.chatService.adminUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Get('admin/chat/users/:userId/messages')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get chat messages with a specific user (admin)' })
  adminMessages(
    @CurrentUser('id') adminUserId: number,
    @Param('userId') userId: string,
  ) {
    return this.chatService.adminMessages(adminUserId, Number(userId));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Post('admin/chat/users/:userId/read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark chat with a specific user as read (admin)' })
  markAdminRead(
    @CurrentUser('id') adminUserId: number,
    @Param('userId') userId: string,
  ) {
    return this.chatService.markAdminRead(adminUserId, Number(userId));
  }
}