import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCulinaryDto, EditCulinaryDto } from './dto'

@Injectable()
export class CulinaryService {
  constructor(private prisma: PrismaService) {}

  async getCulinaries() {
    const culinaries = await this.prisma.culinary.findMany()
    return culinaries
  }

  async getCulinaryById(culinaryId: number) {
    const culinary = await this.prisma.culinary.findFirst({
      where: {
        id: culinaryId,
      },
    })
    return culinary
  }

  async getCulinariesByProvince(provinceId: number) {
    const culinaries = await this.prisma.culinary.findMany({
      where: {
        provinceId: provinceId,
      },
    })
    return culinaries
  }

  async createCulinary(createdId: number, dto: CreateCulinaryDto) {
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

    return culinary
  }

  async editCulinary(updatedId: number, culinaryId: number, dto: EditCulinaryDto) {
    if (dto.provinceId != null) {
      const province = await this.prisma.province.findUnique({
        where: {
          id: dto.provinceId,
        },
      })

      if (!province) throw new ForbiddenException('province not found')
    }

    return this.prisma.culinary.update({
      where: {
        id: culinaryId,
      },
      data: {
        updatedId,
        ...dto,
      },
    })
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
