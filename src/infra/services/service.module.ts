import { Module } from "@nestjs/common";
import { HashService } from "./HashService";
import { EncryptionGateway } from "@/core/domain/users/common/gateway/EncryptonGateway";

@Module({
    providers:[
        {
            provide:EncryptionGateway,
            useClass:HashService
        }
    ],
    exports:[EncryptionGateway]
})
export class ServiceModule{}