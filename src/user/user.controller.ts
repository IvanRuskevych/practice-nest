import { Controller, Delete, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    findAllUser() {
        return this.userService.findAllUsers();
    }

    @Get(':idOrEmail')
    findOne(@Param('idOrEmail') idOrEmail: string) {
        return this.userService.findUser(idOrEmail);
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //     return this.userService.update(+id, updateUserDto);
    // }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.removeUser(id);
    }
}
