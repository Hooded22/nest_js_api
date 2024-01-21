import { Injectable } from '@nestjs/common';
import { PrismaService } from '../persistence/prisma.service';
import { ProductsService } from '../products/products.service';
import { Order, Product } from '@prisma/client';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  findAll() {
    return this.prismaService.invoice.findMany({
      include: {
        products: true,
        order: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  async createInvoice(productsIds: Product['id'][], orderId: Order['id']) {
    const products = await this.productsService.getProductsByMultipleIds(
      productsIds,
    );

    return this.prismaService.invoice.create({
      data: {
        quantity: products.length,
        totalPrice: products.reduce((acc, el) => acc + el.price, 0),
        products: {
          create: products.map((product) => ({
            price: product.price,
            name: product.name,
          })),
        },
        order: {
          connect: {
            id: orderId,
          },
        },
      },
      include: {
        products: true,
        order: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }
}
