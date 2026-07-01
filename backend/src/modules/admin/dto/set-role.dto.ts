import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../users/schemas/user.schema';

export class SetRoleDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
