import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { GetUser } from '../auth/decorator'
import { JwtGuard } from '../auth/guard'
import { CreateProvinceDto } from './dto'
import { EditProvinceDto } from './dto/edit-province.dto'
import { ProvinceService } from './province.service'

@UseGuards(JwtGuard)
@Controller('provinces')
export class ProvinceController {
  constructor(private provinceService: ProvinceService) {}

  @Get()
  getProvinces() {
    return this.provinceService.getProvinces()
  }

  @Get(':id')
  getProvinceById(@Param('id', ParseIntPipe) provinceId: number) {
    return this.provinceService.getProvinceById(provinceId)
  }

  @Post()
  createProvince(@GetUser('id') createdId: number, @Body() dto: CreateProvinceDto) {
    return this.provinceService.createProvince(createdId, dto)
  }

  @Patch(':id')
  editProvince(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) provinceId: number,
    @Body() dto: EditProvinceDto,
  ) {
    return this.provinceService.editProvince(userId, provinceId, dto)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteProvince(@Param('id', ParseIntPipe) provinceId: number) {
    return this.provinceService.deleteProvince(provinceId)
  }
}
