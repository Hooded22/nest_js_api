import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PersistenceModule],
})
export class UsersModule {}
