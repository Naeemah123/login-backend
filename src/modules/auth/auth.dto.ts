import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class AuthLoginBodyDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class AuthRegisterBodyDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;
}

export class AuthRefreshTokenBodyDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
