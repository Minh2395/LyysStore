import { IsEnum, IsNotEmpty, Matches } from 'class-validator';
import { UserRole } from '../../users/schemas/user.schema';

export class SetRoleDto {
  @IsNotEmpty()
  @Matches(/^[a-f\d]{24}$/i)
  userId: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
