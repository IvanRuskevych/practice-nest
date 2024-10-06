import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export const CookiesDecorator = createParamDecorator((key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return key ? request.cookies[key] : request.cookies;
});
