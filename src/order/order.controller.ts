import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { AddOrderDto } from './dto/addOrderDto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get()
  findAll() {
    return this.orderService.getAllOrders();
  }

  @Post('add-order')
  async addOrder(@Body() orderData: AddOrderDto) {
    return await this.orderService.addOrder(orderData.products);
  }
}
