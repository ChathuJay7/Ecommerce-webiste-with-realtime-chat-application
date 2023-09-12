import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';
import { CartItem } from '../cart/entity/cart-item.entity';
import { ICartItem } from '../cart/interfaces/cart-item.interface';

describe('StripeService', () => {
  let service: StripeService;

  const mockStripeService = {
    createCheckoutSession: jest.fn().mockReturnValue({}),
    createRefundPayment: jest.fn().mockReturnValue({}),
    listenWebhookEvents: jest.fn().mockReturnValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: StripeService,
          useValue: mockStripeService,
        },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
  });

  it('should be defined StripeService', () => {
    expect(service).toBeDefined();
  });

  /**
   * Create Checkout Session
   * Create a new checkout session for the provided product details orderID.
   * @returns A Promise that resolves checkout session obj.
   */
  // describe('createCheckoutSession', () => {
  //   it('should be defined createCheckoutSession', () => {
  //     expect(service.createCheckoutSession).toBeDefined();
  //   });
  //   it('should call the createCheckoutSession method of the StripeService & return the Checkout Session Obj', async () => {
  //     const orderId = 'a9b62dd4-b9ca-4cf2-a810-7c686ff76069';
  //     const orderItems = [
  //       {
  //         id: '46e7f33b-c983-4606-9810-50a1efb38ba9',
  //         quantity: 3,
  //         price: 900,
  //         product: {
  //           id: '94f960dd-59ea-4bf3-b4cb-ee24331cbf6e',
  //           name: 'Samesung galaxy Note20',
  //           color: 'silver',
  //           price: 900,
  //           image:
  //             'https://fdn2.mobgsm.com/vv/bigpic/samsung-galaxy-note20-5g-r.jpg',
  //           discount: 10,
  //           description: 'Manufactured in 2021',
  //           quantity: 47,
  //         },
  //       },
  //     ];
  //     const actualResponse = await service.createCheckoutSession(
  //       orderId,
  //       orderItems,
  //     );
  //     expect(actualResponse).toEqual({});
  //   });
  // });

  /**
   * Create Refund Payment
   * Create a refund payment for the provided paymentID.
   * @returns A Promise that resolves refund details obj.
   */
  describe('createRefundPayment', () => {
    it('should be defined createRefundPayment', () => {
      expect(service.createRefundPayment).toBeDefined();
    });
    it('should return a refund object', async () => {
      const createRefundPaymentObj = {
        paymentId: 'df707f3a-e07d-45f7-a39b-95e099eb3a4b',
        reason: 'Something goes here',
      };
      const expectedRefund = {
        amount: 71000000,
        balance_transaction: 'txn_3NARYyBxRt0Gux4f0WxoYBBv',
        charge: 'ch_3NARYyBxRt0Gux4f0MCVj85H',
        created: 1684734394,
        currency: 'usd',
        id: 're_3NARYyBxRt0Gux4f0VwOvkmy',
        object: 'refund',
        payment_intent: 'pi_3NARYyBxRt0Gux4f0sqMlE92',
        reason: null,
        receipt_number: null,
        source_transfer_reversal: null,
        status: 'succeeded',
        transfer_reversal: null,
      };
      const refundObj = await service.createRefundPayment(
        createRefundPaymentObj.paymentId,
      );
      expect(refundObj).toEqual(expectedRefund);
    });
  });

  /**
   * Listen to webhook events
   * Listen to the Stripe webhook events and performing the Database status updating functionalities.
   * @returns A Promise that resolves refund details obj.
   */
  describe('listenWebhookEvents', () => {
    it('should be defined listenWebhookEvents', () => {
      expect(service.listenWebhookEvents).toBeDefined();
    });
  });
});
