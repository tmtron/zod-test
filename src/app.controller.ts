import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DOG_OAPI_SCHEMA, dogSchema } from './zod-dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('zod')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('validate')
  @ApiOperation({
    description: 'zod validation of dogSchema',
    requestBody: {
      content: {
        'application/json': {
          schema: DOG_OAPI_SCHEMA,
        },
      },
    },
  })
  validate(@Body() param: any) {
    const cujo = dogSchema.parse(param);
    return cujo;
  }

  @Get('valid')
  valid() {
    const cujo = dogSchema.parse({
      name: 'Cujo',
      neutered: true,
    }); // passes, returns Dog
    return cujo;
  }

  @Get('invalid')
  invalid() {
    const cujo = dogSchema.parse({
      name: 'Cujo',
    }); // passes, returns Dog
    return cujo;
  }
}
