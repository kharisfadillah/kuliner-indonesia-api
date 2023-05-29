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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { GetUser } from '../auth/decorator'
import { JwtGuard } from '../auth/guard'
import { CulinaryService } from './culinary.service'
import { CreateCulinaryDto, EditCulinaryDto } from './dto'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { join } from 'path'

@ApiTags('Culinary')
@ApiBearerAuth()
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(__dirname, 'images'),
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`
          cb(null, filename)
        },
      }),
    }),
  )
  createCulinary(
    @GetUser('id') createdId: number,
    @Body() dto: CreateCulinaryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    console.log(image)
    dto.image = image.filename
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
