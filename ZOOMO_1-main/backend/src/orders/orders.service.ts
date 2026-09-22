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
     ✅ Now includes driver (with live lat/lng) and address — needed
     for the live tracking map on the customer side.
  ============================ */
  async getOrderById(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { dish: true } },
        restaurant: true,
        address: true,
        payment: true,
        driver: {
          include: { user: { select: { name: true, phone: true } } },
        },
      },
    });

    if (!order) throw new NotFoundException("Order not found");
    if (order.userId !== userId) throw new BadRequestException("Unauthorized");

    return order;
  }

  /* ===========================
     CREATE ORDER + PAYMENT
     ✅ FIX: this used to always use the ENTIRE cart (cart.items) and
     derive the restaurant from whichever dish happened to be first in
     it — completely ignoring the restaurantId and items the frontend
     actually sent. That broke the multi-restaurant Bag: checking out
     with one restaurant could silently pull in dishes from a totally
     different one, and would wipe the ENTIRE bag afterward regardless
     of which restaurant was checked out.
     Now: uses data.restaurantId and data.items directly, validates
     every dish actually belongs to that restaurant, prices are always
     re-fetched from the DB (never trusts client-sent prices), and only
     that restaurant's cart items are cleared — everything else in the
     bag is left untouched.
  ============================ */
  async createOrder(userId: string, data: any) {
    const {
      restaurantId,
      addressId,
      items,
      specialInstructions,
      tip,
      paymentMethod,
      promoCode,
      orderType,
      guestCount,
      scheduledFor,
    } = data;

    if (!restaurantId) throw new BadRequestException("restaurantId is required");
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException("No items provided for this order");
    }

    // ✅ Re-fetch every dish from the DB — never trust client-sent price,
    // and reject any dish that doesn't actually belong to this restaurant
    // (defends against a tampered request mixing restaurants together).
    const dishIds = items.map((i: any) => i.dishId);
    const dishes = await this.prisma.dish.findMany({
      where: { id: { in: dishIds } },
    });

    const dishMap = new Map(dishes.map((d) => [d.id, d]));

    for (const item of items) {
      const dish = dishMap.get(item.dishId);
      if (!dish) throw new BadRequestException(`Dish ${item.dishId} not found`);
      if (dish.restaurantId !== restaurantId) {
        throw new BadRequestException(
          "All items in an order must belong to the same restaurant",
        );
      }
    }

    /* ── Totals ── */
    const subtotal = items.reduce((sum: number, item: any) => {
      const dish = dishMap.get(item.dishId)!;
      return sum + item.quantity * dish.price;
    }, 0);

    const tipAmount = tip || 0;
    const tax = parseFloat((subtotal * 0.05).toFixed(2));

    /* ── Delivery fee — none for dine-in/takeaway ── */
    let deliveryFee = orderType === "DELIVERY" ? 29 : 0;

    /* ── Promo ── */
    let discount = 0;
    let validatedPromoCode: string | null = null;

    if (promoCode) {
      const promo = PROMO_CODES[promoCode.toUpperCase()];
      if (!promo) throw new BadRequestException("Invalid promo code");
      validatedPromoCode = promoCode.toUpperCase();
      if (promo.type === "percent") {
        discount = Math.min(
          parseFloat(((subtotal * promo.value) / 100).toFixed(2)),
          promo.max ?? Infinity,
        );
      } else if (promo.type === "flat") {
        discount = Math.min(promo.value, subtotal);
      } else if (promo.type === "ship" && orderType === "DELIVERY") {
        deliveryFee = 0;
      }
    }

    const total = parseFloat(
      (subtotal + deliveryFee + tax + tipAmount - discount).toFixed(2),
    );

    const orderStatus = scheduledFor
      ? OrderStatus.SCHEDULED
      : OrderStatus.PENDING;

    /* ── Transaction ── */
    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          restaurantId,
          addressId: addressId || null,
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
            create: items.map((item: any) => {
              const dish = dishMap.get(item.dishId)!;
              return {
                dishId: item.dishId,
                quantity: item.quantity,
                price: dish.price,
                specialInstructions: item.specialInstructions || null,
              };
            }),
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

      // ✅ FIX: only clear THIS restaurant's cart items — anything from
      // other restaurants in the bag stays put for a separate checkout.
      const restaurantDishIds = (
        await tx.dish.findMany({ where: { restaurantId }, select: { id: true } })
      ).map((d) => d.id);

      await tx.cartItem.deleteMany({
        where: {
          cart: { userId },
          dishId: { in: restaurantDishIds },
        },
      });

      return createdOrder;
    });

    return order;
  }
}
