import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ColoristService } from '../colorist.service';
import { ICreateColorist } from '../interfaces';

class UniqueColoristException extends BadRequestException {
  constructor(public readonly paths: string[]) {
    super(`Already exists a Colorist using: ${paths.join(', ')}.`);
  }
}

@Injectable()
export class UniqueColoristValidationPipe implements PipeTransform {
  constructor(private readonly coloristService: ColoristService) {}

  async transform(value: ICreateColorist): Promise<ICreateColorist> {
    const { email, username } = value;

    const coloristByUsername = await this.coloristService.exists({
      username,
    });

    const coloristByEmail = await this.coloristService.exists({
      email,
    });

    const paths: string[] = [];

    if (coloristByUsername) {
      paths.push('username');
    }

    if (coloristByEmail) {
      paths.push('email');
    }

    if (paths.length) {
      throw new UniqueColoristException(paths);
    }

    return value;
  }
}
