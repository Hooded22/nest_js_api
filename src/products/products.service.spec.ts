import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../persistence/prisma.service';
import { AddProductDto } from './dto/addProductDto';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('Should call productCollection.findAll() when findMany is called', async () => {
      const findManySpy = jest
        .spyOn(prismaService.product, 'findMany')
        .mockResolvedValueOnce([]);

      await service.findAll();

      expect(findManySpy).toHaveBeenCalledWith();
    });
  });

  describe('addProduct', () => {
    it('Should call productCollection.create with name and price when user added product', async () => {
      const createSpy = jest
        .spyOn(prismaService.product, 'create')
        .mockResolvedValueOnce({ name: 'test', id: 1, price: 12 });

      const mockedProductToAdd: AddProductDto = {
        name: 'mocked_name',
        price: 123,
      };

      await service.addProduct(mockedProductToAdd);

      expect(createSpy).toHaveBeenCalledWith({ data: mockedProductToAdd });
    });
  });
});
