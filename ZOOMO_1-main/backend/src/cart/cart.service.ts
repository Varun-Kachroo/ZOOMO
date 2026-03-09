import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  /* ================= GET CART ================= */
  async getCart(userId: string) {
    if (!userId) throw new BadRequestException("❌ userId missing");

    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { dish: true },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: { include: { dish: true } },
        },
      });
    }

    return { items: cart.items }; // 👈 RETURN ONLY ITEMS ARRAY!
  }

  /* ================= ADD ITEM ================= */
  async addItem(userId: string, dishId: string, quantity: number = 1) {
    if (!userId) throw new BadRequestException("❌ userId missing");
    if (!dishId) throw new BadRequestException("❌ dishId missing");

    const dish = await this.prisma.dish.findUnique({ where: { id: dishId } });
    if (!dish) throw new NotFoundException("❌ Dish not found");

    let cart = await this.ensureCart(userId);

    /* ============ RESTAURANT CONFLICT ============ */
    if (cart.items.length > 0) {
      const firstItem = cart.items[0];
      const firstDish = firstItem
        ? await this.prisma.dish.findUnique({ where: { id: firstItem.dishId } })
        : null;

      if (firstDish && firstDish.restaurantId !== dish.restaurantId) {
        await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    }

    /* ============ ADD OR UPDATE ITEM ============ */
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

    return this.getCart(userId); // 👈 CONSISTENT RETURN
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

  // 🛠 load cart to get userId
  const cart = await this.prisma.cart.findUnique({
    where: { id: item.cartId },
    include: { user: true },
  });

  if (!cart) {
    throw new NotFoundException("⚠️ Cart not found — data inconsistency");
  }

  return this.getCart(cart.userId);
}

  /* ================= REMOVE ================= */
  async removeItem(itemId: string) {
    if (!itemId) throw new BadRequestException("❌ item id missing");

    const item = await this.prisma.cartItem.findUnique({ where: { id: itemId } });

    if (!item) return { items: [] };

    await this.prisma.cartItem.delete({ where: { id: itemId } });

    const userCart = await this.prisma.cart.findUnique({
      where: { id: item.cartId },
    });

    if (!userCart || !userCart.userId) {
      return { items: [] };
    }

    return this.getCart(userCart.userId);
  }

  /* ================= CLEAR CART ================= */
  async clearCart(userId: string) {
    if (!userId) throw new BadRequestException("❌ userId missing");

    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { items: [] };

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

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
