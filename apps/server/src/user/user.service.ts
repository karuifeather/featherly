import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async create(createUserDto: any) {
    return true;
  }
}
