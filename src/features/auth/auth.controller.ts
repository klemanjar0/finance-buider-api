import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserPayload } from './entities';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() payload: CreateUserPayload): Promise<string> {
    return this.authService.create(payload);
  }

  @Post('sign_in')
  signIn(@Body() payload: CreateUserPayload): Promise<string> {
    return this.authService.signIn(payload);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
