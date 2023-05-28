import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class EditProvinceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string
}
