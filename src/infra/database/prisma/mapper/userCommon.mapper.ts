import { UserCommon } from "@/core/domain/users/common/entity/UserCommon";
import { CPF } from "@/core/domain/users/common/objectValues/CPF";
import { Email } from "@/core/domain/users/common/objectValues/Email";
import { Identity } from "@/core/generics/Identity";
import { UserCommon as UserCommonDatabase } from "generated/prisma";

export class UserCommonMaper{
    static toDomain(entity:UserCommonDatabase):UserCommon{
        const emailOrError = Email.create(entity.email);
        const cpfOrError = CPF.create(entity.cpf);
        if(emailOrError.isLeft() || cpfOrError.isLeft()){
            throw new Error("Error to create UserCommon domain");
        }

        return UserCommon.create({
            fullName:entity.fullName,
            email:emailOrError.value,
            cpf:cpfOrError.value,
            password:entity.password,
            common:entity.common,
            saldo:entity.saldo,
            createdAt:entity.createdAt
        },new Identity(entity.id))
    }

    static toDatabase(entity:UserCommon):UserCommonDatabase{
        return {
            id:entity.identity.valueId,
            fullName:entity.fullName,
            email:entity.email.toValue,
            cpf:entity.cpf.toValue,
            password:entity.password,
            saldo:entity.saldo,
            common:entity.userCommon,
            createdAt:entity.createdAt
        }
    }
}