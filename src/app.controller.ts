import {Body, Controller, Get, Post} from '@nestjs/common';
import {AppService} from './app.service';
import {dogSchema} from './zod-dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('validate')
  validate(@Body() param: unknown) {
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
