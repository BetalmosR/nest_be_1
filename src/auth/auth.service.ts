import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto, SignUpDto } from 'src/dtos/Credentials.dto';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { hashPassword, validatePassword } from './auth.validate';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(credentials: SignUpDto): Promise<void> {
    const { username, email, password } = credentials;

    const salt = await bcrypt.genSalt(10);
    const newPassword = await hashPassword(password, salt);

    const newUser = this.userRepository.create({
      id: uuid(),
      username,
      password: newPassword,
      email,
    });

    await this.userRepository.save(newUser);
  }

  async signIn(credentials: SignInDto): Promise<{ accessToken: string }> {
    const { username, password } = credentials;

    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (user && (await validatePassword(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new BadRequestException();
    }
  }
}
