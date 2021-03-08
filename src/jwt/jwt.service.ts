import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interfaces';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly option: JwtModuleOptions,
  ) {}
  sign(userdata: object): string {
    return jwt.sign(userdata, this.option.tokenkey);
  }
  verify(token: string) {
    return jwt.verify(token, this.option.tokenkey);
  }
}
