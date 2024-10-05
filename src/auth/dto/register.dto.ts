import { IsPasswordRepeatMatching } from 'libs/common/decorators';
import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @Validate(IsPasswordRepeatMatching)
    passwordRepeat: string;
}
