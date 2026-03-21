import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { OrderStatus } from "@prisma/client";

const PROMO_CODES: Record<string, { type: string; value: number; max?: number }> = {
  ZOOMO50: { type: "percent", value: 50, max: 100 },
  BOGO: { type: "flat", value: 60 },
  FREESHIP: { type: "ship", value: 29 },
  HEALTHY20: { type: "percent", value: 20, max: 80 },
  NEWUSER: { type: "flat", value: 80 },
};

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  /* ===========================
     GET USER ORDERS
  ============================ */
  getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { dish: true } },
        restaurant: true,
        payment: true,
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
        payment: true,
      },
    });

    if (!order) throw new NotFoundException("Order not found");
    if (order.userId !== userId) throw new BadRequestException("Unauthorized");

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
      paymentMethod,
      promoCode,
      scheduledFor,
    } = data;

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { dish: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException("Cart is empty");
    }

    /* ── Totals ── */
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.dish.price,
      0
    );
    const tipAmount = tip || 0;
    const tax = parseFloat((subtotal * 0.05).toFixed(2));

    /* ── Promo ── */
    let discount = 0;
    let deliveryFee = 29;
    let validatedPromoCode: string | null = null;

    if (promoCode) {
      const promo = PROMO_CODES[promoCode.toUpperCase()];
      if (!promo) throw new BadRequestException("Invalid promo code");
      validatedPromoCode = promoCode.toUpperCase();
      if (promo.type === "percent") {
        discount = Math.min(
          parseFloat(((subtotal * promo.value) / 100).toFixed(2)),
          promo.max ?? Infinity
        );
      } else if (promo.type === "flat") {
        discount = Math.min(promo.value, subtotal);
      } else if (promo.type === "ship") {
        deliveryFee = 0;
      }
    }

    const total = parseFloat(
      (subtotal + deliveryFee + tax + tipAmount - discount).toFixed(2)
    );

    /* ── Restaurant ── */
    const restaurantDish = await this.prisma.dish.findUnique({
      where: { id: cart.items[0].dishId },
      include: { restaurant: true },
    });

    if (!restaurantDish) throw new BadRequestException("Invalid restaurant");

    /* ── Status ── */
    const orderStatus = scheduledFor
      ? OrderStatus.SCHEDULED
      : OrderStatus.PENDING;

    /* ── Transaction ── */
    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          restaurantId: restaurantDish.restaurantId,
          addressId,
          subtotal,
          deliveryFee,
          tax,
          total,
          tip: tipAmount,
          promoCode: validatedPromoCode,
          discount,
          scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
          specialInstructions,
          status: orderStatus,
          items: {
            create: cart.items.map((item) => ({
              dishId: item.dishId,
              quantity: item.quantity,
              price: item.dish.price,
              specialInstructions: item.specialInstructions || null,
            })),
          },
        },
      });

      await tx.payment.create({
        data: {
          orderId: createdOrder.id,
          amount: total,
          currency: "INR",
          method: paymentMethod || "COD",
          status: "PENDING",
          provider: paymentMethod === "COD" ? "COD" : "ONLINE",
        },
      });

      return createdOrder;
    });

    /* ── Clear cart ── */
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  }
}