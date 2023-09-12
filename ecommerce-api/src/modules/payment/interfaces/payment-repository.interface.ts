import { IBaseRepositoy } from 'src/core/repositories/base/base-interface.repository';
import { Payment } from '../entity/payment.entity';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

export const PaymentRepositoryInterface = 'IPaymentRepository';

export interface IPaymentRepository extends IBaseRepositoy<Payment> {
  update(
    id: string | number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment>;
  findOneByCheckoutSessionId(checkoutSessionId: string): Promise<Payment>;
  findOneByOrderId(orderId: string): Promise<Payment>;
}
