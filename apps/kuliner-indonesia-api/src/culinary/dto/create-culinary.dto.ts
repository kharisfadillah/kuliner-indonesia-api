import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateCulinaryDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  provinceId: number
}
