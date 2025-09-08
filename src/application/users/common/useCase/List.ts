import { UserCommon } from "@/core/domain/users/common/entity/UserCommon";
import { FindAllParams, PaginatedResponse, UserCommonGateway } from "@/core/domain/users/common/gateway/UserCommonGateway";

export class ListUserCommonUseCase{
    constructor(private readonly userCommonRepository:UserCommonGateway){}

    async execute(params:FindAllParams):Promise<PaginatedResponse<UserCommon>>{
        return await this.userCommonRepository.list(params);
    }
}