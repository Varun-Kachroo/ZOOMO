import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  /* ===========================
     GET USER ORDERS
  ============================ */
  getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { dish: true },
        },
        restaurant: true,
        payment: true, // 👈 include payment
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /* ===========================
     GET ORDER DETAILS
  ============================ */
  async getOrderById(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { dish: true } },
        restaurant: true,
        payment: true, // 👈 include payment
      },
    });

    if (!order) throw new NotFoundException("Order not found");
    if (order.userId !== userId)
      throw new BadRequestException("Unauthorized");

    return order;
  }

  /* ===========================
     CREATE ORDER + PAYMENT
  ============================ */
  async createOrder(userId: string, data: any) {
    const {
      addressId,
      specialInstructions,
      tip,
      paymentMethod, // "COD" | "ONLINE"
    } = data;

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { dish: true } },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException("Cart is empty");
    }

    /* ===========================
       CALCULATE TOTALS
    ============================ */
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.dish.price,
      0
    );

    const deliveryFee = 29;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax + (tip || 0);

    // All dishes belong to same restaurant
    const restaurantDish = await this.prisma.dish.findUnique({
      where: { id: cart.items[0].dishId },
      include: { restaurant: true },
    });

    if (!restaurantDish) {
      throw new BadRequestException("Invalid restaurant");
    }

    /* ===========================
       TRANSACTION (ORDER + PAYMENT)
    ============================ */
    const order = await this.prisma.$transaction(async (tx) => {
      // 1️⃣ CREATE ORDER
      const createdOrder = await tx.order.create({
        data: {
          userId,
          restaurantId: restaurantDish.restaurantId,
          addressId,
          subtotal,
          deliveryFee,
          tax,
          total,
          tip,
          specialInstructions,
          status: OrderStatus.PENDING,
          items: {
            create: cart.items.map((item) => ({
              dishId: item.dishId,
              quantity: item.quantity,
              price: item.dish.price,
              specialInstructions:
                item.specialInstructions || null,
            })),
          },
        },
      });

      // 2️⃣ CREATE PAYMENT (🔥 FIX)
      await tx.payment.create({
        data: {
          orderId: createdOrder.id,
          amount: total,
          currency: "INR",
          method: paymentMethod || "COD",
          status: "PENDING",
          provider:
            paymentMethod === "COD" ? "COD" : "ONLINE",
        },
      });

      return createdOrder;
    });

    // 3️⃣ CLEAR CART
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  }
}
