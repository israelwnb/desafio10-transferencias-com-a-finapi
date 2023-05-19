import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER =  'transfer'
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    let { user_id } = request.params;
    const { amount, description } = request.body;

    const isTransferStatement = user_id !== undefined;

    const splittedPath = request.originalUrl.split('/');

    const createStatementUseCase = container.resolve(CreateStatementUseCase);

    if (isTransferStatement) {
      const type = splittedPath[splittedPath.length - 2] as OperationType;

      const statement = await createStatementUseCase.execute({
        user_id,
        sender_id,
        type,
        amount,
        description
      });

      return response.status(201).json(statement);
    } else {
      const type = splittedPath[splittedPath.length - 1] as OperationType;
      user_id = sender_id;

      const statement = await createStatementUseCase.execute({
        user_id,
        type,
        amount,
        description
      });

      return response.status(201).json(statement);
    }
  }
}
