import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

/**
 * Roles Decorator
 * Marks routes with required user roles
 * Used with RolesGuard to protect admin-only endpoints
 */
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);


