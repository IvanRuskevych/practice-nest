import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export const UserAgentDecorator = createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-agent'];
});
