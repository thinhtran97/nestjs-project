
import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const RESPONSE_MESSAGE_KEY = 'response_message';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); // key:value pair, key is IS_PUBLIC_KEY, value is true. This will be used to mark routes as public (not requiring authentication).

export const ResponseMessage = (message: string) =>
    SetMetadata(RESPONSE_MESSAGE_KEY, message);

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

