import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service';

interface AuthedSocket extends Socket {
  data: {
    userId?: string;
    role?: string;
    driverId?: string;
  };
}

/**
 * Real-time layer for live order tracking.
 *
 * Rooms are named `order:<orderId>`. A customer joins the room for their
 * own active order and listens; a driver's app emits location updates
 * for whichever order they're currently on, and this gateway persists
 * + rebroadcasts to everyone in that room.
 *
 * Auth: both customer and driver apps sign in with the SAME JWT_SECRET
 * (confirmed from auth.module.ts / driver/auth/auth.module.ts), so one
 * verify() call here handles both — role tells them apart.
 */
@WebSocketGateway({
  cors: {
    origin: (process.env.SOCKET_CORS_ORIGINS || '*').split(','),
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /* ============ CONNECTION AUTH ============ */
  async handleConnection(client: AuthedSocket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      client.data.userId = payload.id;
      client.data.role = payload.role;
      client.data.driverId = payload.driverId; // present only for driver tokens
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthedSocket) {
    // Nothing to clean up server-side — rooms auto-clear on disconnect.
  }

  /* ============ CUSTOMER: JOIN AN ORDER'S ROOM ============ */
  @SubscribeMessage('order:join')
  async handleJoinOrder(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { orderId: string },
  ) {
    if (!client.data.userId) return;

    // Only let the person who actually placed this order listen to it.
    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
      select: { userId: true },
    });

    if (!order || order.userId !== client.data.userId) {
      client.emit('order:error', { message: 'Not your order' });
      return;
    }

    client.join(`order:${data.orderId}`);
    client.emit('order:joined', { orderId: data.orderId });
  }

  @SubscribeMessage('order:leave')
  handleLeaveOrder(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { orderId: string },
  ) {
    client.leave(`order:${data.orderId}`);
  }

  /* ============ DRIVER: PUSH LIVE LOCATION ============ */
  @SubscribeMessage('driver:location')
  async handleDriverLocation(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { orderId: string; lat: number; lng: number },
  ) {
    if (client.data.role !== 'DRIVER' || !client.data.driverId) return;

    // Only let a driver broadcast for an order actually assigned to them.
    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
      select: { driverId: true },
    });

    if (!order || order.driverId !== client.data.driverId) return;

    // Persist so a customer who joins mid-delivery (or reconnects) can
    // still fetch a last-known position via the normal REST order fetch.
    await this.prisma.driver.update({
      where: { id: client.data.driverId },
      data: { currentLat: data.lat, currentLng: data.lng, updatedAt: new Date() },
    });

    // Broadcast to everyone (the customer) watching this order.
    this.server.to(`order:${data.orderId}`).emit('order:driverLocation', {
      orderId: data.orderId,
      lat: data.lat,
      lng: data.lng,
    });
  }

  /* ============ SERVER-SIDE: BROADCAST STATUS CHANGES ============
     Called from other services (merchant order status updates, driver
     pickup/delivered actions) — not triggered by a client message. */
  broadcastOrderStatus(orderId: string, status: string) {
    this.server.to(`order:${orderId}`).emit('order:statusChanged', {
      orderId,
      status,
    });
  }
}
