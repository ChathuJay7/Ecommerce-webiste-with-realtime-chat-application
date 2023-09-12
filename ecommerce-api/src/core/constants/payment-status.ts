export const PaymentStatus = {
  PENDING: 'PENDING', //The customer create the order & payment pending
  PROCESSING: 'PROCESSING', //The customer create the checkout session & payment process
  SUCCEEDED: 'SUCCEEDED', //The customer’s payment succeeded
  FAILED: 'FAILED', //The customer’s payment was declined by a card network or otherwise expired
  REFUNDED: 'REFUNDED', ////The customer’s payment refunded
};
