import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { PersistenceModule } from '../persistence/persistence.module';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService],
  imports: [PersistenceModule, ProductsModule],
  exports: [InvoicesService],
})
export class InvoicesModule {}
