import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../modules/users/schemas/user.schema';

// =========================
// PUBLIC ROUTE
// =========================
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// =========================
// RESPONSE MESSAGE DECORATOR
// =========================
export const RESPONSE_MESSAGE = 'response_message';
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);

// =========================
// ROLE BASED ACCESS CONTROL (STRICT TYPE)
// =========================
export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
