import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateDto } from './dto/create.dto';
import { isLogLevelEnabled } from '@nestjs/common/services/utils';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('test')
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get('get/:id')
  getHello(@Param('id', ParseIntPipe) id: number): number {
    if (id < 10) {
      throw new BadRequestException('ID should be more than 10 ');
    }
    return id;
  }

  // @UsePipes(new ValidationPipe()) // TODO: кращою практикою є глобальні налаштування в main.ts
  @Post('create')
  async create(@Body() dto: CreateDto): Promise<CreateDto> {
    return await this.appService.save(dto);
  }
}
