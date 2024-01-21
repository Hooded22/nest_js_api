import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PersistenceModule } from '../persistence/persistence.module';
import { ProductsModule } from '../products/products.module';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [PersistenceModule, ProductsModule, InvoicesModule],
})
export class OrderModule {}
