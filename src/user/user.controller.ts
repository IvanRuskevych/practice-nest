import {
    Controller,
    Get,
    Post,
    Body,
    // Patch,
    Param,
    Delete,
    ParseUUIDPipe,
} from '@nestjs/common';

import { CreateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    createUser(@Body() userDto: CreateUserDto) {
        return this.userService.create(userDto);
    }

    @Get()
    findAllUser() {
        return this.userService.findAll();
    }

    @Get(':idOrEmail')
    findOne(@Param('idOrEmail', ParseUUIDPipe) idOrEmail: string) {
        return this.userService.findOne(idOrEmail);
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //     return this.userService.update(+id, updateUserDto);
    // }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.remove(id);
    }
}
