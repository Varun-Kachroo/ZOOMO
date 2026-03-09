import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import Razorpay from "razorpay";
import Stripe from "stripe";

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay;
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2025-12-15.clover",
    });
  }

  /* ===========================
     CREATE PAYMENT INTENT
  =========================== */
  async createPaymentIntent(orderId: string, provider: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      throw new BadRequestException("Order not found");
    }

    const amountInSmallestUnit = Math.round(order.total * 100);

    if (provider === "razorpay") {
      return this.createRazorpayIntent(order, amountInSmallestUnit);
    }

    if (provider === "stripe") {
      return this.createStripeIntent(order, amountInSmallestUnit);
    }

    if (provider === "cod") {
      return this.handleCOD(order);
    }

    throw new BadRequestException("Invalid payment provider");
  }

  /* ===========================
     RAZORPAY
  =========================== */
  async createRazorpayIntent(order: any, amount: number) {
    const rzpOrder = await this.razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: order.id,
    });

    await this.savePayment(
      order.id,
      amount / 100,
      "INR",
      "PENDING",
      "RAZORPAY",
      rzpOrder.id,
      "ONLINE"
    );

    return {
      provider: "razorpay",
      orderId: rzpOrder.id,
      amount,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    };
  }

  /* ===========================
     STRIPE
  =========================== */
  async createStripeIntent(order: any, amount: number) {
    const stripeIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: { orderId: order.id },
    });

    await this.savePayment(
      order.id,
      amount / 100,
      "USD",
      "PENDING",
      "STRIPE",
      stripeIntent.id,
      "ONLINE"
    );

    return {
      provider: "stripe",
      clientSecret: stripeIntent.client_secret,
    };
  }

  /* ===========================
     CASH ON DELIVERY
  =========================== */
  async handleCOD(order: any) {
    await this.savePayment(
      order.id,
      order.total,
      "INR",
      "PENDING",
      "COD",
      null,
      "COD"
    );

    return {
      provider: "cod",
      status: "PENDING",
      message: "Cash on Delivery selected",
    };
  }

  /* ===========================
     SAVE PAYMENT (PRISMA SAFE)
  =========================== */
  async savePayment(
    orderId: string,
    amount: number,
    currency: string,
    status: string,
    provider: string,
    paymentIntentId: string | null,
    method: "COD" | "ONLINE"
  ) {
    return this.prisma.payment.create({
      data: {
        amount,
        currency,
        status,
        provider,
        paymentIntentId,
        method,

        // ✅ REQUIRED RELATION
        order: {
          connect: { id: orderId },
        },
      },
    });
  }
}
