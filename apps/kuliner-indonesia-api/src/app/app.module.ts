import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '../auth/auth.module'
import { CulinaryModule } from '../culinary/culinary.module'
import { PrismaModule } from '../prisma/prisma.module'
import { ProvinceModule } from '../province/province.module'
import { UserModule } from '../user/user.module'
import { FileModule } from '../file/file.module'
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: __dirname,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    ProvinceModule,
    CulinaryModule,
    PrismaModule,
    FileModule,
  ],
})
export class AppModule {}
