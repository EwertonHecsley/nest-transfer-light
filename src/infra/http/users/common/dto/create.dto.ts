import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserCommonDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required.' })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Format invalid.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'CPF is required.' })
  cpf: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Type user is required.' })
  common: boolean;
}
