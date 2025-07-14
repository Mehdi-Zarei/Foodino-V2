import { PartialType } from "@nestjs/swagger";
import { UserAddressDto } from "./user.dto";

export class UpdateUserAddressDto extends PartialType(UserAddressDto) {}
