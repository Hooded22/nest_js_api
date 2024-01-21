import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { PrismaService } from '../persistence/prisma.service';
import { ProductsService } from '../products/products.service';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let prismaService: PrismaService;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: PrismaService,
          useValue: {
            invoice: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: ProductsService,
          useValue: {
            getProductsByMultipleIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    prismaService = module.get(PrismaService);
    productsService = module.get(ProductsService);
  });

  describe('findAll', () => {
    it('Should call prisma.invoice.findMany with params', async () => {
      const findManySpy = jest
        .spyOn(prismaService.invoice, 'findMany')
        .mockResolvedValue([]);

      await service.findAll();

      expect(findManySpy).toHaveBeenCalledWith({
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
    });
  });

  describe('createInvoice', () => {
    it('Should call productsService.getProductsByMultipleIds with product ids array', async () => {
      const getProductsByMultipleIdsSpy = jest
        .spyOn(productsService, 'getProductsByMultipleIds')
        .mockResolvedValue([]);

      const productsIdArray = [1, 2, 3];

      await service.createInvoice(productsIdArray, 1);

      expect(getProductsByMultipleIdsSpy).toHaveBeenCalledWith(productsIdArray);
    });
  });
});
