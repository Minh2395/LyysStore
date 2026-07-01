import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
  MinLength,
} from 'class-validator';

// ======================
// REGISTER DTO
// ======================
export class CreateAuthDto {
  @IsNotEmpty({ message: 'email không được để trống' })
  @IsEmail({}, { message: 'email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'password không được để trống' })
  @IsString()
  @MinLength(6, { message: 'password phải >= 6 ký tự' })
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

// ======================
// VERIFY ACCOUNT DTO
// ======================
export class CodeAuthDto {
  @IsNotEmpty({ message: '_id không được để trống' })
  @IsMongoId({ message: '_id không hợp lệ' })
  _id: string;

  @IsNotEmpty({ message: 'code không được để trống' })
  @IsString()
  code: string;
}

// ======================
// CHANGE PASSWORD DTO
// ======================
export class ChangePasswordAuthDto {
  @IsNotEmpty({ message: 'email không được để trống' })
  @IsEmail({}, { message: 'email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'code không được để trống' })
  @IsString()
  code: string;

  @IsNotEmpty({ message: 'password không được để trống' })
  @IsString()
  @MinLength(6, { message: 'password phải >= 6 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'confirmPassword không được để trống' })
  @IsString()
  confirmPassword: string;
}
