import { Module, forwardRef } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PaymentGatewayInterface } from './interfaces/payment-gatway.interface';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [forwardRef(() => PaymentModule)],
  providers: [
    {
      provide: `${PaymentGatewayInterface}`,
      useClass: StripeService,
    },
  ],
  exports: [
    {
      provide: `${PaymentGatewayInterface}`,
      useClass: StripeService,
    },
  ],
})
export class StripeModule {}
