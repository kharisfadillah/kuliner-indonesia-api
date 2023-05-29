import { Controller, Get, Post, Res, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common'
import { createReadStream } from 'fs'
import { join } from 'path'
import { Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

@Controller('file')
export class FileController {
  @Get()
  getFile(@Res({ passthrough: true }) res: Response): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'uploads/1678626187164-Screenshot from 2023-03-11 21-08-14.png'))
    res.set({
      'Content-Type': 'image/x-png',
      'Content-Disposition': 'attachment; filename="haha.png"',
    })
    return new StreamableFile(file)
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: __dirname,
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`
          cb(null, filename)
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file)
  }
}
