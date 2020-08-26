import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { dogSchema } from './zod-dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { zodToOapi3 } from './zod-to-oapi3/zod-to-oapi3';

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
          schema: zodToOapi3(dogSchema),
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
