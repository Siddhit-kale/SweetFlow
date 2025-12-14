import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Auth Guard
 * Protects routes requiring authentication
 * Validates JWT token from Authorization header
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}


