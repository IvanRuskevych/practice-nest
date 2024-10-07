import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { IJwtPayload } from '../types';

export const CurrentUser = createParamDecorator(
    (key: keyof IJwtPayload, ctx: ExecutionContext): IJwtPayload | Partial<IJwtPayload> => {
        const request = ctx.switchToHttp().getRequest();
        return key ? request.user[key] : request.user;
    },
);
