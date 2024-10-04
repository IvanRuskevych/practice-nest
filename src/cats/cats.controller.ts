import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    HttpCode,
    Header,
    Redirect,
    Query,
    HttpStatus,
    Global,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Observable, of } from 'rxjs';
import { Cat } from './entities/cat.entity';

@Global() // TODO: making module be available everywhere out-of-the-box (e.g., helpers, database connections, httpService, etc.)
@Controller('cats')
export class CatsController {
    constructor(private readonly catsService: CatsService) {}

    @Post()
    // create(@Body() createCatDto: CreateCatDto) {
    //     return this.catsService.create(createCatDto);
    // }
    // @HttpCode(201)
    @HttpCode(HttpStatus.CREATED)
    @Header('content-type', 'application/json')
    // @Header('Cache-Control', 'none')
    async create(@Body() createCatDto: CreateCatDto) {
        // return 'This action adds a new cat';
        this.catsService.create(createCatDto);
    }

    // @Get()
    // findAll(@Req() req: Request): string {
    //     // return this.catsService.findAll();
    //     return `This action returns all cats`;
    // }

    @Get()
    async findAll(): Promise<Cat[]> {
        return this.catsService.findAll();
        // return `This action returns all cats`;
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        // return this.catsService.findOne(+id);
        return `This action returns a #${id} cat`;
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
        return this.catsService.update(+id, updateCatDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.catsService.remove(+id);
    }

    //     ================================0000

    @Get('docs')
    @Redirect('https://docs.nestjs.com', 302)
    getDocs(@Query('version') version: string): { url: string } {
        if (version && version === '5') {
            return { url: 'https://docs.nestjs.com/v5/' };
        }
    }

    @Get()
    async findAllAsync(): Promise<any[]> {
        return [];
    }

    @Get()
    findAllObservable(): Observable<any[]> {
        return of([]);
    }
}
