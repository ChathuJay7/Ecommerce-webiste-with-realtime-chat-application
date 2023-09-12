export interface IPayment {
  /**
   * The ID of the payment.
   */
  id: string;

  /**
   * The total amount of the payment.
   */
  totalAmount: number;

  /**
   * The status of the payment.
   */
  status: string;

  /**
   * The date of the payment.
   */
  date: string;

  /**
   * The order ID of the payment.
   */
  orderId: string;

  /**
   * The payment checkout session ID of the payment session.
   */
  checkoutSessionId: string;

  /**
   * The checkout session URL of the payment.
   */
  checkoutUrl: string;

  /**
   * The payment intent ID of the checkout session.
   */
  paymentIntentId: string;
}
