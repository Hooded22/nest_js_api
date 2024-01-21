import { Injectable } from '@nestjs/common';
import { PrismaService } from '../persistence/prisma.service';
import { PrismaClient, Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  productCollection: PrismaClient['product'];
  constructor(private readonly prismaService: PrismaService) {
    this.productCollection = prismaService.product;
  }

  findAll() {
    return this.productCollection.findMany();
  }

  async getProductsByMultipleIds(productIdArray: Product['id'][]) {
    return this.productCollection.findMany({
      where: {
        id: {
          in: productIdArray,
        },
      },
    });
  }

  async getProductPriceArray(productIdArray: Product['id'][]) {
    return this.productCollection.findMany({
      where: {
        id: {
          in: productIdArray,
        },
      },
      select: {
        price: true,
      },
    });
  }

  async addProduct(productData: Omit<Product, 'id'>) {
    return this.productCollection.create({
      data: {
        name: productData.name,
        price: productData.price,
      },
    });
  }
}
