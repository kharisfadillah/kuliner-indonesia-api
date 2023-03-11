import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'
import { PrismaService } from '../../../kuliner-indonesia-api/src/prisma/prisma.service'
import { AppModule } from '../../../kuliner-indonesia-api/src/app/app.module'
import { RegisterDto } from 'apps/kuliner-indonesia-api/src/auth/dto'
import { EditUserDto } from 'apps/kuliner-indonesia-api/src/user/dto'
import { CreateProvinceDto, EditProvinceDto } from 'apps/kuliner-indonesia-api/src/province/dto'

describe('App e2e', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    await app.init()
    await app.listen(3333)

    prisma = app.get(PrismaService)
    await prisma.cleanDb()
    pactum.request.setBaseUrl('http://localhost:3333')
  })

  afterAll(() => {
    app.close()
  })

  describe('Auth', () => {
    const dto: RegisterDto = {
      email: 'kharisf@gmail.com',
      password: '123456',
      firstName: 'Kharisa',
      lastName: 'Fadillah',
    }
    describe('Register', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            password: dto.password,
            firstName: dto.firstName,
          })
          .expectStatus(400)
      })
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: dto.email,
            firstName: dto.firstName,
          })
          .expectStatus(400)
      })
      it('should throw if firstName empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: dto.email,
            password: dto.password,
          })
          .expectStatus(400)
      })
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/register').expectStatus(400)
      })
      it('should register', () => {
        return pactum.spec().post('/auth/register').withBody(dto).expectStatus(201)
      })
    })

    describe('Login', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
      })
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
      })
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/login').expectStatus(400)
      })
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email,
            password: dto.password,
          })
          .expectStatus(201)
          .stores('userAt', 'access_token')
      })
    })
  })

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
      })
    })

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Kharis',
          email: 'kharisf@gmail.com',
        }
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email)
      })
    })
  })

  describe('Provinces', () => {
    describe('Get empty provinces', () => {
      it('should get provinces', () => {
        return pactum
          .spec()
          .get('/provinces')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([])
      })
    })

    describe('Create province', () => {
      const dto: CreateProvinceDto = {
        name: 'Kalimantan Selatang',
      }
      it('should create province', () => {
        return pactum
          .spec()
          .post('/provinces')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('kalselProvinceId', 'id')
      })
    })

    describe('Create province', () => {
      const dto: CreateProvinceDto = {
        name: 'Sulawesi Selatan',
      }
      it('should create province', () => {
        return pactum
          .spec()
          .post('/provinces')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('sulselProvinceId', 'id')
      })
    })

    describe('Get provinces', () => {
      it('should get provinces', () => {
        return pactum
          .spec()
          .get('/provinces')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(2)
      })
    })

    describe('Get province by id', () => {
      it('should get province by id', () => {
        return pactum
          .spec()
          .get('/provinces/{id}')
          .withPathParams('id', '$S{kalselProvinceId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{kalselProvinceId}')
      })
    })

    describe('Get province by id', () => {
      it('should get province by id', () => {
        return pactum
          .spec()
          .get('/provinces/{id}')
          .withPathParams('id', '$S{sulselProvinceId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{sulselProvinceId}')
      })
    })

    describe('Edit province by id', () => {
      const dto: EditProvinceDto = {
        name: 'Kalimantan Selatan',
      }
      it('should edit province', () => {
        return pactum
          .spec()
          .patch('/provinces/{id}')
          .withPathParams('id', '$S{kalselProvinceId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.name)
      })
    })

    describe('Delete province by id', () => {
      it('should delete province', () => {
        return pactum
          .spec()
          .delete('/provinces/{id}')
          .withPathParams('id', '$S{sulselProvinceId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204)
      })

      it('should get 1 province', () => {
        return pactum
          .spec()
          .get('/provinces')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1)
      })
    })
  })

  describe('Culinaries', () => {
    describe('Get empty culinaries', () => {
      it('should get culinaries', () => {
        return pactum
          .spec()
          .get('/culinaries')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([])
      })
    })

    describe('Create culinary', () => {
      it('should create culinary', () => {
        return pactum
          .spec()
          .post('/culinaries')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            name: 'Soto Banjara',
            description: 'Soto Banjar adalah soto khas suku Banjar, Kalimantan Selatan',
            provinceId: '$S{kalselProvinceId}',
          })
          .expectStatus(201)
          .stores('sotoBanjarId', 'id')
      })
    })

    describe('Create culinary', () => {
      it('should create culinary', () => {
        return pactum
          .spec()
          .post('/culinaries')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            name: 'Ketupat Kandangan',
            description: 'Ketupat Kandangan merupakan kuliner khas daerah Kandangan, Kalimantan Selatan. ',
            provinceId: '$S{kalselProvinceId}',
          })
          .expectStatus(201)
          .stores('ketupatKandanganId', 'id')
      })
    })

    describe('Get culinaries', () => {
      it('should get culinaries', () => {
        return pactum
          .spec()
          .get('/culinaries')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(2)
      })
    })

    describe('Get culinary by id', () => {
      it('should get culinary by id', () => {
        return pactum
          .spec()
          .get('/culinaries/{id}')
          .withPathParams('id', '$S{sotoBanjarId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{sotoBanjarId}')
      })
    })

    describe('Get culinary by province', () => {
      it('should get culinary by province', () => {
        return pactum
          .spec()
          .get('/culinaries/province/{id}')
          .withPathParams('id', '$S{kalselProvinceId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{kalselProvinceId}')
      })
    })

    describe('Edit culinary by id', () => {
      it('should edit culinary $S{kalselProvinceId}', () => {
        return pactum
          .spec()
          .patch('/culinaries/{id}')
          .withPathParams('id', '$S{sotoBanjarId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            name: 'Soto Banjar',
            description: 'Soto Banjar adalah soto khas suku Banjar, Kalimantan Selatan',
            provinceId: '$S{kalselProvinceId}',
          })
          .expectStatus(200)
          .expectBodyContains('Soto Banjar')
      })
    })

    describe('Delete culinary by id', () => {
      it('should delete culinary', () => {
        return pactum
          .spec()
          .delete('/culinaries/{id}')
          .withPathParams('id', '$S{sotoBanjarId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204)
      })

      it('should get 1 culinary', () => {
        return pactum
          .spec()
          .get('/culinaries')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1)
      })
    })

    describe('Delete culinary by province', () => {
      it('should delete culinary', () => {
        return pactum
          .spec()
          .delete('/culinaries/province/{id}')
          .withPathParams('id', '$S{kalselProvinceId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204)
      })

      it('should get empty culinaries', () => {
        return pactum
          .spec()
          .get('/culinaries')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0)
      })
    })
  })
})
