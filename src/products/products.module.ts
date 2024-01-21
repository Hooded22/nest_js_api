import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [PersistenceModule],
  exports: [ProductsService],
})
export class ProductsModule {}
