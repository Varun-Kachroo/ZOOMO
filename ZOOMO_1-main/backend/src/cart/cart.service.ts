import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Nested include used everywhere the cart is returned — each item now
  // carries its dish AND that dish's restaurant, so the frontend can
  // group items by restaurant (name, image) without extra API calls.
  private readonly cartInclude = {
    items: {
      include: {
        dish: { include: { restaurant: true } },
      },
    },
  };

  /* ================= GET CART ================= */
  async getCart(userId: string) {
    if (!userId) throw new BadRequestException("❌ userId missing");

    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: this.cartInclude,
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: this.cartInclude,
      });
    }

    return { items: cart.items };
  }

  /* ================= ADD ITEM ================= */
  async addItem(userId: string, dishId: string, quantity: number = 1) {
    if (!userId) throw new BadRequestException("❌ userId missing");
    if (!dishId) throw new BadRequestException("❌ dishId missing");

    const dish = await this.prisma.dish.findUnique({ where: { id: dishId } });
    if (!dish) throw new NotFoundException("❌ Dish not found");

    const cart = await this.ensureCart(userId);

    // ✅ FIX: previously this block wiped the ENTIRE cart the moment a
    // dish from a different restaurant was added — that's what forced
    // the old "replace cart?" confirmation flow. The Bag feature now
    // supports multiple restaurants side by side, so items from
    // different restaurants simply coexist. No wiping.

    const existing = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, dishId },
    });

    if (existing) {
      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId: cart.id, dishId, quantity },
      });
    }

    return this.getCart(userId);
  }

  /* ================= UPDATE QUANTITY ================= */
  async updateItem(id: string, quantity: number) {
    if (!id) throw new BadRequestException("❌ item id missing");

    const item = await this.prisma.cartItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Item not found");

    if (quantity <= 0) {
      await this.prisma.cartItem.delete({ where: { id } });
    } else {
      await this.prisma.cartItem.update({
        where: { id },
        data: { quantity },
      });
    }

    const cart = await this.prisma.cart.findUnique({
      where: { id: item.cartId },
      include: { user: true },
    });

    if (!cart) {
      throw new NotFoundException("⚠️ Cart not found — data inconsistency");
    }

    return this.getCart(cart.userId);
  }

  /* ================= REMOVE ONE ITEM ================= */
  async removeItem(itemId: string) {
    if (!itemId) throw new BadRequestException("❌ item id missing");

    const item = await this.prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item) return { items: [] };

    await this.prisma.cartItem.delete({ where: { id: itemId } });

    const userCart = await this.prisma.cart.findUnique({
      where: { id: item.cartId },
    });

    if (!userCart || !userCart.userId) return { items: [] };

    return this.getCart(userCart.userId);
  }

  /* ================= CLEAR WHOLE CART ================= */
  async clearCart(userId: string) {
    if (!userId) throw new BadRequestException("❌ userId missing");

    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { items: [] };

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return this.getCart(userId);
  }

  /* ================= CLEAR ONE RESTAURANT'S ITEMS ================= */
  // ✅ NEW — used after checking out with ONE restaurant from the Bag.
  // Only removes that restaurant's items, leaving everything else in
  // the bag untouched for the person to check out separately later.
  async clearRestaurantItems(userId: string, restaurantId: string) {
    if (!userId) throw new BadRequestException("❌ userId missing");
    if (!restaurantId) throw new BadRequestException("❌ restaurantId missing");

    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { items: [] };

    // Find this restaurant's dish ids, then delete cart items matching them
    const dishes = await this.prisma.dish.findMany({
      where: { restaurantId },
      select: { id: true },
    });
    const dishIds = dishes.map((d) => d.id);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id, dishId: { in: dishIds } },
    });

    return this.getCart(userId);
  }

  /* ================= UTIL ================= */
  private async ensureCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    return cart;
  }
}
