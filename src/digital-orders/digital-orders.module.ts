import { Module } from '@nestjs/common';
import { DigitalOrdersController } from './digital-orders.controller';
import { DigitalOrdersService } from './digital-orders.service';

@Module({
  controllers: [DigitalOrdersController],
  providers: [DigitalOrdersService],
})
export class DigitalOrdersModule {}
