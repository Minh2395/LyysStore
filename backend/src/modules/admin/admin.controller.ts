import {
  Controller,
  Patch,
  Body,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';

import { Roles } from '../../decorator/customize';
import { JwtAuthGuard } from '../../auth/passport/jwt-auth.guard';
import { RolesGuard } from '../../auth/passport/roles.guard';

import { UsersService } from '../users/users.service';
import { SetRoleDto } from './dto/set-role.dto';
import { UserRole } from '../users/schemas/user.schema';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private usersService: UsersService) {}

  @Patch('users/role')
  async setRole(@Body() body: SetRoleDto, @Req() req: any) {
    if (req?.user?._id === body.userId) {
      throw new ForbiddenException('Không thể thay đổi role của chính mình');
    }

    return this.usersService.updateRole(body.userId, body.role);
  }
}
