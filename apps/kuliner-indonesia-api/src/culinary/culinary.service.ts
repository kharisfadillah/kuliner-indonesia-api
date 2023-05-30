import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCulinaryDto, EditCulinaryDto } from './dto'
import { Request } from 'express'

@Injectable()
export class CulinaryService {
  constructor(private prisma: PrismaService) {}

  async getCulinaries(req: Request) {
    const culinaries = await this.prisma.culinary.findMany()
    return culinaries.map((culinary) => {
      return {
        ...culinary,
        image: `${req.protocol}://${req.headers.host}/images/${encodeURIComponent(culinary.image)}`,
      }
    })
  }

  async getCulinaryById(culinaryId: number, req: Request) {
    const culinary = await this.prisma.culinary.findFirst({
      where: {
        id: culinaryId,
      },
    })
    culinary.image = `${req.protocol}://${req.headers.host}/images/${encodeURIComponent(culinary.image)}`
    return culinary
  }

  async getCulinariesByProvince(provinceId: number, req: Request) {
    const culinaries = await this.prisma.culinary.findMany({
      where: {
        provinceId: provinceId,
      },
    })
    return culinaries.map((culinary) => {
      return {
        ...culinary,
        image: `${req.protocol}://${req.headers.host}/images/${encodeURIComponent(culinary.image)}`,
      }
    })
  }

  async createCulinary(createdId: number, dto: CreateCulinaryDto, req: Request) {
    const province = await this.prisma.province.findUnique({
      where: {
        id: dto.provinceId,
      },
    })

    if (!province) throw new NotFoundException('province not found')

    const culinary = await this.prisma.culinary.create({
      data: {
        createdId,
        updatedId: createdId,
        ...dto,
      },
    })
    culinary.image = `${req.protocol}://${req.headers.host}/images/${encodeURIComponent(culinary.image)}`
    return culinary
  }

  async editCulinary(updatedId: number, culinaryId: number, dto: EditCulinaryDto, req: Request) {
    if (dto.provinceId != null) {
      const province = await this.prisma.province.findUnique({
        where: {
          id: dto.provinceId,
        },
      })

      if (!province) throw new ForbiddenException('province not found')
    }

    const culinary = await this.prisma.culinary.update({
      where: {
        id: culinaryId,
      },
      data: {
        updatedId,
        ...dto,
      },
    })

    culinary.image = `${req.protocol}://${req.headers.host}/images/${encodeURIComponent(culinary.image)}`

    return culinary
  }

  async deleteCulinaryById(culinaryId: number) {
    const culinary = await this.prisma.culinary.findUnique({
      where: {
        id: culinaryId,
      },
    })

    if (!culinary) throw new ForbiddenException('culinary not found')

    await this.prisma.culinary.delete({
      where: {
        id: culinaryId,
      },
    })
  }

  async deleteCulinariesByProvince(provinceId: number) {
    const province = await this.prisma.province.findUnique({
      where: {
        id: provinceId,
      },
    })

    if (!province) throw new ForbiddenException('province not found')

    const culinary = await this.prisma.culinary.findMany({
      where: {
        provinceId: provinceId,
      },
    })

    if (!culinary) throw new ForbiddenException('culinary not found')

    await this.prisma.culinary.deleteMany({
      where: {
        provinceId: provinceId,
      },
    })
  }
}
