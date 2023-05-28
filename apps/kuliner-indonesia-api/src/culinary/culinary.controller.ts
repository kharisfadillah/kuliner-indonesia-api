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
import { CulinaryService } from './culinary.service'
import { CreateCulinaryDto, EditCulinaryDto } from './dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Culinary')
@UseGuards(JwtGuard)
@Controller('culinaries')
export class CulinaryController {
  constructor(private culinaryService: CulinaryService) {}

  @Get()
  getCulinaries() {
    return this.culinaryService.getCulinaries()
  }

  @Get(':id')
  getCulinaryById(@Param('id', ParseIntPipe) culinaryId: number) {
    return this.culinaryService.getCulinaryById(culinaryId)
  }

  @Get('province/:id')
  getCulinariesByProvince(@Param('id', ParseIntPipe) provinceId: number) {
    return this.culinaryService.getCulinariesByProvince(provinceId)
  }

  @Post()
  createCulinary(@GetUser('id') createdId: number, @Body() dto: CreateCulinaryDto) {
    console.log({ provinceId: dto.provinceId})
    return this.culinaryService.createCulinary(createdId, dto)
  }

  @Patch(':id')
  editCulinary(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) culinaryId: number,
    @Body() dto: EditCulinaryDto,
  ) {
    return this.culinaryService.editCulinary(userId, culinaryId, dto)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteCulinaryById(@Param('id', ParseIntPipe) culinaryId: number) {
    return this.culinaryService.deleteCulinaryById(culinaryId)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('province/:id')
  deleteCulinariesByProvince(@Param('id', ParseIntPipe) provinceId: number) {
    return this.culinaryService.deleteCulinariesByProvince(provinceId)
  }
}
