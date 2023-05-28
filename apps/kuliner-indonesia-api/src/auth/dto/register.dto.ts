import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class RegisterDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    lastName: string
}