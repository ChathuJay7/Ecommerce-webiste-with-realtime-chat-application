import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IPaymentGateway } from 'src/modules/stripe/interfaces/payment-gatway.interface';
import { CartItem } from '../cart/entity/cart-item.entity';
import { Payment } from '../payment/entity/payment.entity';
import Stripe from 'stripe';
import getConfig from '../../core/config/configurations';
import { Messages } from 'src/core/constants/messages';
import { Status_Code } from 'src/core/constants/status-codes';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class StripeService implements IPaymentGateway {
  private stripe: Stripe;

  constructor(private readonly paymentService: PaymentService) {
    this.stripe = new Stripe(`${getConfig().STRIPE.secretKey}`, {
      apiVersion: '2022-11-15',
    });
  }

  async createCheckoutSession(
    orderId: string,
    orderItems: CartItem[],
  ): Promise<any> {
    console.log(orderItems);
    const productData = orderItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          images: [item.product.image],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: productData,
      metadata: {
        orderId,
      },
      mode: 'payment',
      success_url: `${getConfig().APP.clientUrl}payment/success`,
      cancel_url: `${getConfig().APP.clientUrl}payment/cancel`,
    });

    return session;
  }

  async createRefundPayment(paymentIntentId: string): Promise<any> {
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    return refund;
  }

  async listenWebhookEvents(signature: string, payload: Buffer): Promise<any> {
    const webhookSecret = `${getConfig().STRIPE.webhookSecret}`;
    if (!signature) {
      throw new BadRequestException({
        message: Messages.ERROR.BAD_REQUEST,
        status_code: Status_Code.ERROR_CODE.BAD_REQUEST,
      });
    }
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
      const paymentIntent = await event.data.object;

      switch (event.type) {
        case 'checkout.session.completed':
          await this.paymentService.checkoutSessionCompleted(paymentIntent);
          break;
        case 'payment_intent.succeeded':
          await this.paymentService.paymentIntentSucceeded(paymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.paymentService.paymentIntentFailed(paymentIntent);
          break;
        case 'charge.refunded':
          await this.paymentService.paymentIntentRefunded(paymentIntent);
          break;
        default:
          console.log('DEFAULT EVENT TRIGGER');
          break;
      }
    } catch (err) {
      console.log(err);
    }
  }
}
