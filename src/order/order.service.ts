import { Injectable } from '@nestjs/common';
import { PrismaService } from '../persistence/prisma.service';
import { Product } from '@prisma/client';
import { ProductsService } from '../products/products.service';
import { InvoicesService } from '../invoices/invoices.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsService: ProductsService,
    private readonly invoicesService: InvoicesService,
  ) {}

  private parseOrderProducts(orderArray: any[]) {
    return orderArray.map((order) => ({
      ...order,
      products: order?.products?.map((orderProduct) => orderProduct.product),
    }));
  }

  async getAllOrders() {
    const orders = await this.prismaService.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        products: {
          select: {
            product: true,
          },
        },
      },
    });

    return this.parseOrderProducts(orders);
  }

  async addOrder(productIdArray: Product['id'][]) {
    const productsPrices = await this.productsService.getProductPriceArray(
      productIdArray,
    );

    const addedOrder = await this.prismaService.order.create({
      data: {
        price: productsPrices.reduce((acc, el) => acc + el.price, 0),
        user: {
          connect: {
            id: 1,
          },
        },
        products: {
          create: productIdArray.map((id) => ({
            product: {
              connect: {
                id,
              },
            },
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        products: {
          select: {
            product: true,
          },
        },
      },
    });

    await this.invoicesService.createInvoice(productIdArray, addedOrder.id);

    return this.parseOrderProducts([addedOrder]);
  }
}
