import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateCulinaryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string

  @IsString()
  @IsOptional()
  image: string

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  provinceId: number

  @ApiPropertyOptional({ name: 'image', type: 'string', format: 'binary' })
  imageFile: any
}
