import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Get User Decorator
 * Extracts user object from request
 * User is attached by JwtStrategy after token validation
 */
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);


