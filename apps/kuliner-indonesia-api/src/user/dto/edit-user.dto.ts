import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString } from 'class-validator'

export class EditUserDto {
  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string
}
