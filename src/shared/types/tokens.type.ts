import type { RefreshToken } from '@prisma/client';

export interface ITokens {
    accessToken: string;
    refreshToken: RefreshToken;
}
