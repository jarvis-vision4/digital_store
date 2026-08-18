import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private prisma;
    server: Server;
    constructor(jwtService: JwtService, prisma: PrismaService);
    private serialize;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(): void;
    private getUser;
    onUserSend(client: Socket, body: {
        content?: string;
    }): Promise<{
        event: string;
        data: string;
    } | {
        event: string;
        data: {
            id: number;
            userId: number;
            senderRole: any;
            content: any;
            readByUserAt: any;
            readByAdminAt: any;
            createdAt: any;
        };
    }>;
    onAdminSend(client: Socket, body: {
        userId?: number;
        content?: string;
    }): Promise<{
        event: string;
        data: string;
    } | {
        event: string;
        data: {
            id: number;
            userId: number;
            senderRole: any;
            content: any;
            readByUserAt: any;
            readByAdminAt: any;
            createdAt: any;
        };
    }>;
    onUserRead(client: Socket): Promise<{
        event: string;
    }>;
    onAdminRead(client: Socket, body: {
        userId?: number;
    }): Promise<{
        event: string;
        data: string;
    } | {
        event: string;
        data?: undefined;
    }>;
}
