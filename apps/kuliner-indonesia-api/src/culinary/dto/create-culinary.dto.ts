import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateCulinaryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    provinceId: number;
}