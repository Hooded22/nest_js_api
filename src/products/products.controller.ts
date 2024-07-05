import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AddProductDto } from './dto/addProductDto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Post()
  addProduct(@Body() product: AddProductDto) {
    return this.productService.addProduct(product);
  }
}
