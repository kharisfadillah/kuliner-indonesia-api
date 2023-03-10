import { IsNotEmpty, IsString } from "class-validator";

export class EditProvinceDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}