import { Either, left, right } from "src/shared/utils/either";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type EmailValidationError = 'INVALID_FORMAT' | 'EMPTY_EMAIL';

export class Email{
    private readonly value:string;

    private constructor(value:string){
        this.value = value;
    }

    public static create(email:string):Either<EmailValidationError,Email>{
        if(!email) return left('EMPTY_EMAIL');
        if(!email.includes('@')) return left('INVALID_FORMAT');
        if(!emailRegex.test(email))return left('INVALID_FORMAT');

        return right(new Email(email));
    }

    get toValue():string{
        return this.value;
    }
}