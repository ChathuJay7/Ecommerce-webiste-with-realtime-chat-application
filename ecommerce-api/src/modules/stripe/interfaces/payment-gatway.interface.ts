import { CartItem } from 'src/modules/cart/entity/cart-item.entity';
import { Payment } from 'src/modules/payment/entity/payment.entity';

export const PaymentGatewayInterface = 'IPaymentGateway';

export interface IPaymentGateway {
  createCheckoutSession(orderId: string, orderItems: CartItem[]): Promise<any>;
  createRefundPayment(paymentIntentId: string): Promise<any>;
  listenWebhookEvents(signature: string, payload: Buffer): Promise<any>;
}
