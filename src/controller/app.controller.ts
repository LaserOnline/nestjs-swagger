import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppService } from '../service/app.service';
import { RegisterMessage } from 'src/model/register-message.interface';
import { LoginMessage } from 'src/model/login-message.interface';
import { UpdatePasswordMessage } from 'src/model/update-password-message.interface';
import { ApiBody } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  @ApiBody({ type: RegisterMessage })
  register(@Body() register: RegisterMessage): any {
    return this.appService.getRegister(register);
  }

  @Post('login')
  @ApiBody({ type: LoginMessage })
  login(@Body() login: LoginMessage): any {
    return this.appService.getLogin(login);
  }

  @Get('users')
  users(): any {
    return this.appService.getData();
  }

  @Get('users/:id')
  getUsersById(@Param('id') id: string): any {
    return this.appService.getUsers(id);
  }
  @Patch('update-password')
  @ApiBody({ type: UpdatePasswordMessage })
  updatePassword(@Body() updatePassword: UpdatePasswordMessage): any {
    return this.appService.getUpdatePassword(updatePassword);
  }

  @Delete('delete=user/:username')
  deleteUser(@Param('username') username: string): any {
    return this.appService.getDelete(username);
  }
}
