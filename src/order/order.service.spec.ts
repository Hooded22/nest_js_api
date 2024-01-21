import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from '../persistence/prisma.service';
import { ProductsService } from '../products/products.service';
import { Order } from '@prisma/client';
import { InvoicesService } from '../invoices/invoices.service';

describe('OrderService', () => {
  let service: OrderService;
  let prismaService: PrismaService;
  let productsService: ProductsService;
  let invoicesService: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: ProductsService,
          useValue: {
            getProductPriceArray: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            order: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: InvoicesService,
          useValue: {
            createInvoice: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prismaService = module.get<PrismaService>(PrismaService);
    productsService = module.get(ProductsService);
    invoicesService = module.get(InvoicesService);
  });

  describe('getAllOrders', () => {
    it('Should call prisma.order.findMany with options allows select user and products data', async () => {
      const findManySpy = jest
        .spyOn(prismaService.order, 'findMany')
        .mockResolvedValue([]);

      await service.getAllOrders();

      expect(findManySpy).toHaveBeenCalledWith({
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
    });
  });

  describe('addOrder', () => {
    it('Should call productsService.getProductPriceArray with product ids array', async () => {
      const getProductPriceArraySpy = jest
        .spyOn(productsService, 'getProductPriceArray')
        .mockResolvedValue([]);

      const productsIdArray = [1, 2, 3];

      await service.addOrder(productsIdArray);

      expect(getProductPriceArraySpy).toHaveBeenCalledWith(productsIdArray);
    });

    it('should return created order', async () => {
      const order = {
        id: 1,
        price: 22.33,
        userId: 2,
        products: undefined,
      };

      jest.spyOn(productsService, 'getProductPriceArray').mockResolvedValue([]);
      jest.spyOn(prismaService.order, 'create').mockResolvedValue(order);

      expect(await service.addOrder([1])).toEqual([order]);
    });

    it('should call invoicesService.createInvoice with product ids array and added order id', async () => {
      const order = {
        id: 1,
        price: 22.33,
        userId: 2,
        products: undefined,
      };
      const productsIdArray = [1, 2, 3];

      const createInvoiceSpy = jest.spyOn(invoicesService, 'createInvoice');
      jest.spyOn(productsService, 'getProductPriceArray').mockResolvedValue([]);
      jest.spyOn(prismaService.order, 'create').mockResolvedValue(order);

      await service.addOrder(productsIdArray);

      expect(createInvoiceSpy).toHaveBeenCalledWith(productsIdArray, order.id);
    });
  });
});
