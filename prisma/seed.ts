import { PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();
import { faker } from '@faker-js/faker';

(async function () {
  await prisma.user.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.invoice.deleteMany({});

  await prisma.user.create({
    data: {
      id: 1,
      email: 'peter@reporterzz.com',
      password: '123123123',
      lastName: 'Lopez',
      firstName: 'Peter',
    },
  });

  const products: Product[] = [];

  for (let i = 0; i < 5; i++) {
    const product = { id: i, ...makeProduct() };
    const result = await prisma.product.create({ data: product });
    products.push(result);
  }

  const orders = [
    makeOrder(1, [1, 2]),
    makeOrder(1, [3, 1]),
    makeOrder(1, [4]),
    makeOrder(1, [1, 2, 3, 4]),
  ];

  for (const order of orders) {
    await prisma.order.create({
      data: {
        price: order.price,
        user: {
          connect: {
            id: order.user,
          },
        },
        products: {
          create: order.products.map((productId) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });
  }

  const invoices = [
    makeInvoice(1, [products[1], products[2]]),
    makeInvoice(2, [products[3], products[1]]),
  ];

  for (const invoice of invoices) {
    await prisma.invoice.create({
      data: {
        quantity: invoice.products.length,
        totalPrice: invoice.totalPrice,
        products: {
          create: invoice.products.map((product) => ({
            price: product.price,
            name: product.name,
          })),
        },
        order: {
          connect: {
            id: invoice.order,
          },
        },
      },
    });
  }
})();

function makeProduct() {
  return {
    name: faker.commerce.productName(),
    price: faker.number.float({ min: 0, max: 100000 }),
  };
}

function makeOrder(userId: number, productsIds: number[]) {
  return {
    price: faker.number.float({ min: 0, max: 100000 }),
    user: userId,
    products: productsIds,
  };
}

function makeInvoice(orderId: number, products: Product[]) {
  return {
    createdAt: new Date(),
    quantity: faker.number.int({ min: 1, max: 100 }),
    totalPrice: faker.number.float({ min: 0, max: 100000 }),
    order: orderId,
    products,
  };
}
