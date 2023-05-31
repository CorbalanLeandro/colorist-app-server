import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { AbstractService } from '../../common';
import { ICreateClient } from './interfaces';
import { Client, ClientDocument } from './schemas';

@Injectable()
export class ClientService extends AbstractService<
  ICreateClient,
  ClientDocument
> {
  constructor(
    @InjectModel(Client.name)
    protected model: Model<ClientDocument>,
  ) {
    super(ClientService.name, model);
  }
}
