import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProvinceDto, EditProvinceDto } from './dto'

@Injectable()
export class ProvinceService {
  constructor(private prisma: PrismaService) {}

  async getProvinces() {
    const provinces = await this.prisma.province.findMany()
    return provinces
  }

  async getProvinceById(provinceId: number) {
    const province = await this.prisma.province.findFirst({
      where: {
        id: provinceId,
      },
    })
    return province
  }

  async createProvince(createdId: number, dto: CreateProvinceDto) {
    const province = await this.prisma.province.create({
      data: {
        createdId,
        updatedId: createdId,
        ...dto,
      },
    })

    return province
  }

  async editProvince(updatedId: number, provinceId: number, dto: EditProvinceDto) {
    const province = await this.prisma.province.findFirst({
      where: {
        id: provinceId,
      },
    })
    return this.prisma.province.update({
      where: {
        id: provinceId,
      },
      data: {
        updatedId,
        ...dto,
      },
    })
  }

  async deleteProvince(
    provinceId: number,
  ) {
    const province =
      await this.prisma.province.findUnique({
        where: {
          id: provinceId,
        },
      });

    if (!province)
      throw new ForbiddenException(
        'province not found',
      );

    await this.prisma.province.delete({
      where: {
        id: provinceId,
      },
    });
  }
}
