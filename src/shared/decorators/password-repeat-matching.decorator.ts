import {
    type ValidationArguments,
    ValidatorConstraint,
    type ValidatorConstraintInterface,
} from 'class-validator';
import type { RegisterDto } from '../../auth/dto/register.dto';

@ValidatorConstraint({ name: 'IsPasswordRepeatMatching', async: false })
export class IsPasswordRepeatMatching implements ValidatorConstraintInterface {
    validate(passwordRepeat: string, args?: ValidationArguments): Promise<boolean> | boolean {
        const obj = args.object as RegisterDto;
        return obj.password === passwordRepeat;
    }

    defaultMessage(): string {
        return 'Passwords do not match';
    }
}
