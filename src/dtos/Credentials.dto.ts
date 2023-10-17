import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message: 'Password not strong enough',
  })
  password: string;
}

export class SignUpDto extends SignInDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @MinLength(12)
  email: string;
}
