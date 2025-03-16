import { Test, TestingModule } from '@nestjs/testing';
import { PestsController } from '../pests.controller';

describe('PestsController', () => {
  let controller: PestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PestsController],
    }).compile();

    controller = module.get<PestsController>(PestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
