import { BaseAbstractRepositoryImpl } from 'src/core/repositories/base/base-abstract.repository';
import { Payment } from '../entity/payment.entity';
import { IPaymentRepository } from '../interfaces/payment-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

export class PaymentRepository
  extends BaseAbstractRepositoryImpl<Payment>
  implements IPaymentRepository
{
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {
    super(paymentRepository);
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const entityToUpdate = await this.findOneById(id);
    if (!entityToUpdate) {
      return null;
    }
    Object.assign(entityToUpdate, updatePaymentDto);
    return await this.paymentRepository.save(entityToUpdate);
  }

  async findOneByCheckoutSessionId(
    checkoutSessionId: string,
  ): Promise<Payment> {
    return await this.paymentRepository.findOne({
      where: { checkoutSessionId: checkoutSessionId },
    });
  }

  async findOneByOrderId(orderId: string): Promise<Payment> {
    return await this.paymentRepository.findOne({
      where: { orderId: orderId },
    });
  }
}
