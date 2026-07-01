import { PartialType } from '@nestjs/mapped-types';
import { SetRoleDto } from './set-role.dto';

export class UpdateAdminDto extends PartialType(SetRoleDto) {}
