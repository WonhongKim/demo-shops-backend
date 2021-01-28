import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users/entities/user.entity';

export type AllowedRoles = keyof typeof Role | 'Any';

export const UserRole = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
