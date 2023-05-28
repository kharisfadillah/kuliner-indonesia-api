import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class EditCulinaryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  provinceId: number
}
