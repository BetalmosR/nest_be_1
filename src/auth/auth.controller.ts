import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from 'src/dtos/Credentials.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body(ValidationPipe) credentials: SignUpDto): Promise<void> {
    return this.authService.signUp(credentials);
  }

  @Post('sign-in')
  signIn(
    @Body(ValidationPipe) credentials: SignInDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(credentials);
  }
}
