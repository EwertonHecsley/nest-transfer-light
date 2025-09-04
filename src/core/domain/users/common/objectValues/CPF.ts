import { Either, left, right } from "@/shared/utils/either";
import { BadRequestException } from "@nestjs/common";

export class CPF{
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string):Either<BadRequestException,CPF> {
        const isValid = this.validate(value);
        if (!isValid) return left(new BadRequestException('Invalid CPF format. Expected format: XXX.XXX.XXX-XX'));
        return right(new CPF(value));
    }

    private static validate(email: string): boolean {
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
        return cpfRegex.test(email);
    }

    get toValue(): string {
        return this.value;
    }

    public toFormattedValue(): string {
        return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
}