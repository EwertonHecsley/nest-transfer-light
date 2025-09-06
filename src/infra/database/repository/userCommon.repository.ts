import { UserCommonGateway } from "@/core/domain/users/common/gateway/UserCommonGateway";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserCommon } from "@/core/domain/users/common/entity/UserCommon";

@Injectable()
export class UserCommonRepository implements UserCommonGateway{
    constructor(private readonly prismaService:PrismaService){}

    async create(entity: UserCommon): Promise<UserCommon> {
        
    }

    async findByEmail(email: string): Promise<UserCommon | null> {
        
    }

    async findByCpf(cpf: string): Promise<UserCommon | null> {
        
    }

    async findById(id: string): Promise<UserCommon | null> {
        
    }
}