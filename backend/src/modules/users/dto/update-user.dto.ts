import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';

import { AccountType, UserRole } from '../schemas/user.schema';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'email không đúng định dạng' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'password phải ít nhất 6 ký tự' })
  password?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(AccountType, {
    message: 'account_type phải là LOCAL, GOOGLE hoặc FACEBOOK',
  })
  account_type?: AccountType;

  @IsOptional()
  @IsEnum(UserRole, {
    message: 'role phải là USER, ADMIN hoặc STAFF',
  })
  role?: UserRole;

  @IsOptional()
  is_active?: boolean;
}
