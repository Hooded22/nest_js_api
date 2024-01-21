import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [OrderModule, UsersModule, ProductsModule, InvoicesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
