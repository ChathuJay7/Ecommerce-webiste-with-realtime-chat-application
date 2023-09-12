import { Test, TestingModule } from '@nestjs/testing';
import { PaymentRepository } from './payment.repository';
import { IPayment } from '../interfaces/payment.interface';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

describe('PaymentRepository', () => {
  let repository: PaymentRepository;

  let mockPaymentObj: IPayment = {
    id: 'string',
    totalAmount: 1,
    status: 0,
    date: '04-19-2023',
  };

  let updatePaymentDto = new UpdatePaymentDto();
  updatePaymentDto.totalAmount = 1000;
  updatePaymentDto.status = 2;
  updatePaymentDto.date = '04-19-2023';

  const mockPaymentRepository = {
    findOneById: jest.fn().mockReturnValue(mockPaymentObj),
    save: jest.fn().mockReturnValue(mockPaymentObj),
    assign: jest.fn().mockReturnValue(mockPaymentObj),
    update: jest.fn().mockReturnValue(mockPaymentObj),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PaymentRepository,
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    repository = module.get<PaymentRepository>(PaymentRepository);
  });

  it('should be defined PaymentRepository', () => {
    expect(repository).toBeDefined();
  });

  describe('update', () => {
    const id = expect.any(String);
    it('should be defined update', () => {
      expect(repository.update).toBeDefined();
    });
    it('should call the update method of the PaymentRepository & return the updated Payment entity match with ID', async () => {
      jest.spyOn(mockPaymentRepository, 'findOneById').mockResolvedValue(mockPaymentObj);
      const actualResponse = await repository.update(id, updatePaymentDto);
      expect(actualResponse).toEqual(mockPaymentObj);
      expect(mockPaymentRepository.update).toHaveBeenCalledWith(id, updatePaymentDto);
    });
  });

});
