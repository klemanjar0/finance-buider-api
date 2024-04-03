import { Model, Schema } from 'mongoose';
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserSchema } from '../../models/user/UserSchema';
import { CreateUserPayload, isCreateUserPayload } from './entities';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { compareHash, makeHash } from '../../utils/common/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // caution! no validation yet
  async create(payload: CreateUserPayload): Promise<{ authToken: string }> {
    if (!isCreateUserPayload(payload)) {
      throw new UnprocessableEntityException();
    }

    const existingUser = await this.userModel.findOne({ email: payload.email });

    if (!!existingUser) {
      throw new ConflictException();
    }

    const user = new this.userModel({
      email: payload.email,
      id: uuidv4(),
      createdAt: new Date(),
      password: await makeHash(payload.password),
    });

    await user.save();

    const obj = { sub: user.id, email: user.email };
    return {
      authToken: await this.jwtService.signAsync(obj),
    };
  }

  async signIn(payload: CreateUserPayload): Promise<{ authToken: string }> {
    const user = await this.userModel.findOne({ email: payload.email });

    if (!isCreateUserPayload(payload) || !user) {
      throw new UnprocessableEntityException();
    }

    if (await compareHash(user.password, payload.password)) {
      throw new UnauthorizedException();
    }

    const obj = { sub: user.id, email: user.email };

    return {
      authToken: await this.jwtService.signAsync(obj),
    };
  }

  async getProfile(id: string): Promise<User> {
    return this.userModel.findOne({ id: id });
  }
}
