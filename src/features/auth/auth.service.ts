import { Model, Schema } from 'mongoose';
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../models/user/UserSchema';
import {
  CreateUserPayload,
  isCreateUserPayload,
  SignInSuccessDto,
} from './entities';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { compareHash, makeHash } from '../../utils/common/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(payload: CreateUserPayload): Promise<SignInSuccessDto> {
    const existingUser = await this.userModel.findOne({ email: payload.email });

    if (!!existingUser) {
      throw new ConflictException('User with provided name already exists.');
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
      username: user.email,
    };
  }

  async signIn(payload: CreateUserPayload): Promise<SignInSuccessDto> {
    const user = await this.userModel.findOne({ email: payload.email });

    const isPasswordMatch = await compareHash(user.password, payload.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }

    const obj = { sub: user.id, email: user.email };

    return {
      authToken: await this.jwtService.signAsync(obj),
      username: user.email,
    };
  }

  async getProfile(id: string): Promise<User> {
    return this.userModel.findOne({ id: id });
  }
}
