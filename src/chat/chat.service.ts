import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../common/enums';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  private serialize(message: any) {
    return {
      id: Number(message.id),
      userId: Number(message.userId),
      senderRole: message.senderRole,
      content: message.content,
      readByUserAt: message.readByUserAt,
      readByAdminAt: message.readByAdminAt,
      createdAt: message.createdAt,
    };
  }

  async userMessages(userId: number) {
    const messages = await this.prisma.chatMessage.findMany({
      where: { userId: BigInt(userId) },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });
    return messages.map((m) => this.serialize(m));
  }

  async userUnread(userId: number) {
    const count = await this.prisma.chatMessage.count({
      where: {
        userId: BigInt(userId),
        senderRole: { in: [UserRole.ADMIN, UserRole.MODERATOR] },
        readByUserAt: null,
      },
    });
    return { unread: count };
  }

  async markUserRead(userId: number) {
    await this.prisma.chatMessage.updateMany({
      where: {
        userId: BigInt(userId),
        senderRole: { in: [UserRole.ADMIN, UserRole.MODERATOR] },
        readByUserAt: null,
      },
      data: { readByUserAt: new Date() },
    });
    return { unread: 0 };
  }

  async adminUsers() {
    const users = await this.prisma.user.findMany({
      where: { chatMessages: { some: {} } },
      select: {
        id: true,
        username: true,
        chatMessages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true, createdAt: true, senderRole: true },
        },
        _count: {
          select: {
            chatMessages: {
              where: { senderRole: UserRole.CUSTOMER, readByAdminAt: null },
            },
          },
        },
      },
    });

    return users
      .map((u) => ({
        userId: Number(u.id),
        username: u.username,
        lastMessage: u.chatMessages[0]?.content ?? null,
        lastMessageAt: u.chatMessages[0]?.createdAt ?? null,
        lastSender: u.chatMessages[0]?.senderRole ?? null,
        unread: u._count.chatMessages,
      }))
      .sort((a, b) => (b.lastMessageAt?.getTime() ?? 0) - (a.lastMessageAt?.getTime() ?? 0));
  }

  async adminMessages(adminUserId: number, targetUserId: number) {
    await this.ensureAdminTarget(adminUserId, targetUserId);
    const messages = await this.prisma.chatMessage.findMany({
      where: { userId: BigInt(targetUserId) },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });
    return messages.map((m) => this.serialize(m));
  }

  async markAdminRead(adminUserId: number, targetUserId: number) {
    await this.ensureAdminTarget(adminUserId, targetUserId);
    await this.prisma.chatMessage.updateMany({
      where: {
        userId: BigInt(targetUserId),
        senderRole: UserRole.CUSTOMER,
        readByAdminAt: null,
      },
      data: { readByAdminAt: new Date() },
    });
    return { unread: 0 };
  }

  private async ensureAdminTarget(adminUserId: number, targetUserId: number) {
    const target = await this.prisma.user.findUnique({
      where: { id: BigInt(targetUserId) },
      select: { id: true, username: true },
    });
    if (!target) throw new NotFoundException('User not found');
    if (Number(target.id) === adminUserId) {
      throw new ForbiddenException('Cannot chat with yourself');
    }
    return target;
  }
}