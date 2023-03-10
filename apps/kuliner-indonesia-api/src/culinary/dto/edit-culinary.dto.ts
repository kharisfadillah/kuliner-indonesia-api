import { IsNumber, IsOptional, IsString } from 'class-validator'

export class EditCulinaryDto {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsNumber()
  @IsOptional()
  provinceId: number
}
