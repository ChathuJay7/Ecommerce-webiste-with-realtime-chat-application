import { Module, forwardRef } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './repository/payment.repository';
import { PaymentRepositoryInterface } from './interfaces/payment-repository.interface';
import { Payment } from './entity/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { OrderModule } from '../order/order.module';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), UserModule, OrderModule, StripeModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: `${PaymentRepositoryInterface}`,
      useClass: PaymentRepository,
    },
  ],
  exports: [
    PaymentService,
    {
      provide: `${PaymentRepositoryInterface}`,
      useClass: PaymentRepository,
    },
  ],
})
export class PaymentModule {}
