import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateCulinaryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  provinceId: number
}
