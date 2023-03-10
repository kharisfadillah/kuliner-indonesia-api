import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '../auth/auth.module'
import { CulinaryModule } from '../culinary/culinary.module'
import { PrismaModule } from '../prisma/prisma.module'
import { ProvinceModule } from '../province/province.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    ProvinceModule,
    CulinaryModule,
    PrismaModule,
  ],
})
export class AppModule {}
