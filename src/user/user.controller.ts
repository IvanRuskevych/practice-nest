import {
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    UseInterceptors,
} from '@nestjs/common';
import { UserResponse } from './responses';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    findAllUser() {
        return this.userService.findAllUsers();
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':idOrEmail')
    async findOne(@Param('idOrEmail') idOrEmail: string) {
        const user = await this.userService.findUser(idOrEmail);

        // TODO: автоматичне повернення в Nest через return
        // TODO: Ручне - res.status()json({})
        return new UserResponse(user);
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //     return this.userService.update(+id, updateUserDto);
    // }

    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        const user = await this.userService.findUser(id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return this.userService.removeUser(id);
    }
}
