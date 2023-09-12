import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IPayment } from '../interfaces/payment.interface';
import { PaymentStatus } from 'src/core/constants/payment-status';

@Entity()
export class Payment implements IPayment {
  /**
   * The ID of the payment. Generated automatically by the UUID.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The total amount of the payment.
   */
  @Column()
  totalAmount: number;

  /**
   * The status of the payment.
   */
  @Column({ default: PaymentStatus.PENDING })
  status: string;

  /**
   * The date of the payment.
   */
  @Column()
  date: string;

  /**
   * The order ID of the payment.
   */
  @Column()
  orderId: string;

  /**
   * The payment checkout session ID of the payment session.
   */
  @Column()
  checkoutSessionId: string;

  /**
   * The checkout session URL of the payment.
   */
  @Column({ length: 2000 })
  checkoutUrl: string;

  /**
   * The payment intent ID of the checkout session.
   */
  @Column({ nullable: true })
  paymentIntentId: string;
}
