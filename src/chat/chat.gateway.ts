import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../common/enums';

interface SocketUser {
  id: number;
  username: string;
  role: UserRole;
}

@Injectable()
@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

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

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) throw new UnauthorizedException();
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: BigInt(payload.sub) },
        select: { id: true, username: true, role: true, isActive: true },
      });
      if (!user || !user.isActive) throw new UnauthorizedException();

      const socketUser: SocketUser = {
        id: Number(user.id),
        username: user.username,
        role: user.role as UserRole,
      };
      client.data.user = socketUser;

      if (socketUser.role === UserRole.ADMIN || socketUser.role === UserRole.MODERATOR) {
        await client.join('admins');
      } else {
        await client.join(`user:${socketUser.id}`);
      }
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect() {
    // rooms are cleaned up automatically by socket.io
  }

  private getUser(client: Socket): SocketUser {
    const user = client.data.user as SocketUser | undefined;
    if (!user) throw new UnauthorizedException();
    return user;
  }

  @SubscribeMessage('chat:send')
  async onUserSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { content?: string },
  ) {
    const user = this.getUser(client);
    if (user.role !== UserRole.CUSTOMER) throw new ForbiddenException();
    const content = body?.content?.trim();
    if (!content) return { event: 'error', data: 'Message is empty' };
    if (content.length > 2000) return { event: 'error', data: 'Message too long' };

    const message = await this.prisma.chatMessage.create({
      data: {
        userId: BigInt(user.id),
        senderRole: UserRole.CUSTOMER,
        content,
      },
    });
    const serialized = this.serialize(message);

    this.server.to('admins').emit('chat:message', serialized);
    client.emit('chat:message', serialized);
    return { event: 'ok', data: serialized };
  }

  @SubscribeMessage('admin:send')
  async onAdminSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { userId?: number; content?: string },
  ) {
    const admin = this.getUser(client);
    if (admin.role !== UserRole.ADMIN && admin.role !== UserRole.MODERATOR) {
      throw new ForbiddenException();
    }
    const targetUserId = Number(body?.userId);
    const content = body?.content?.trim();
    if (!targetUserId || !content) return { event: 'error', data: 'Invalid payload' };
    if (content.length > 2000) return { event: 'error', data: 'Message too long' };

    const message = await this.prisma.chatMessage.create({
      data: {
        userId: BigInt(targetUserId),
        senderRole: admin.role,
        content,
      },
    });
    const serialized = this.serialize(message);

    this.server.to(`user:${targetUserId}`).emit('chat:message', serialized);
    this.server.to('admins').emit('chat:message', serialized);
    return { event: 'ok', data: serialized };
  }

  @SubscribeMessage('chat:read')
  async onUserRead(@ConnectedSocket() client: Socket) {
    const user = this.getUser(client);
    await this.prisma.chatMessage.updateMany({
      where: {
        userId: BigInt(user.id),
        senderRole: { in: [UserRole.ADMIN, UserRole.MODERATOR] },
        readByUserAt: null,
      },
      data: { readByUserAt: new Date() },
    });
    client.emit('chat:unread', { unread: 0 });
    return { event: 'ok' };
  }

  @SubscribeMessage('admin:read')
  async onAdminRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { userId?: number },
  ) {
    const admin = this.getUser(client);
    if (admin.role !== UserRole.ADMIN && admin.role !== UserRole.MODERATOR) {
      throw new ForbiddenException();
    }
    const targetUserId = Number(body?.userId);
    if (!targetUserId) return { event: 'error', data: 'Invalid payload' };

    await this.prisma.chatMessage.updateMany({
      where: {
        userId: BigInt(targetUserId),
        senderRole: UserRole.CUSTOMER,
        readByAdminAt: null,
      },
      data: { readByAdminAt: new Date() },
    });
    this.server.to('admins').emit('admin:read', { userId: targetUserId, unread: 0 });
    return { event: 'ok' };
  }
}