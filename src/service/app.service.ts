/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersMessage } from 'src/model/users-message.interface';
import { RegisterMessage } from 'src/model/register-message.interface';
import { LoginMessage } from 'src/model/login-message.interface';
import { UpdatePasswordMessage } from 'src/model/update-password-message.interface';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AppService {

  private readonly users: UsersMessage[] = [];
  private currentId = 1;

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 13; // * จำนวนรอบการเก็บคีย์สำหรับการเข้ารหัส
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  private validateRegister (password:string) {
    const isAlphaNumeric = /^[A-Za-z0-9]+$/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    
    if (!isAlphaNumeric.test(password) || !hasUpperCase.test(password) || !hasLowerCase.test(password) || password.length < 8) {
      throw new BadRequestException('รหัสผ่านของคุณจะต้องมีอย่างน้อย 8 ตัวอักษรและประกอบด้วยภาษาอังกฤษตัวอักษรพิมพ์ใหญ่และพิมพ์เล็ก');
    }

  }

  // * แสดง ข้อมูลผู้ใช้งาน
  getData(): any {
    if (this.users.length == 0) {
      return {
        message: "ไม่มีผู้ใช้งาน"
      }
    } else {
      return this.users
    }

  }
  // * แสดง ข้อมูลผู้ใช้งาน

  // * Select ID
  getUsers(id: string): any {

    const numberId = parseInt(id)

    if (!this.users) {
      throw new NotFoundException('ไม่พบผู้ใช้งาน');
    }

    if (isNaN(numberId)) {
      return {message: 'รูปแบบ ID ไม่ถูกต้อง'}
    }

    const user = this.users.find((u) => u.id === numberId);

    if (!user) {
      throw new NotFoundException('ไม่พบผู้ใช้งาน')
    }

    return user
  }
  // * Select ID

  // * Register
  async getRegister(register: RegisterMessage): Promise<any> {
    const isAlphaNumeric = /^[A-Za-z0-9]+$/;

    if (!register.username) {
      throw new BadRequestException('กรุณากรอง username')
    }

    if (!register.password) {
      throw new BadRequestException('กรุณากรอง password')
    }

    if (!register.password_verify) {
      throw new BadRequestException('กรุณากรอง รหัสผ่านยืนยัน')
    }

    if (!isAlphaNumeric.test(register.username)) {
      throw new BadRequestException('username ต้องประกอบด้วยตัวอักษรภาษาอังกฤษและตัวเลขเท่านั้น')
    } else if (register.username.length < 7) {
      throw new BadRequestException('username จะต้องไม่ต่ำกว่า 7')
    }

    this.validateRegister(register.password)

    if (register.password != register.password_verify) {
      throw new BadRequestException('รหัสผ่านของคุณไม่ถูกต้อง')
    }

    if (this.users.some(u => u.username === register.username)) {
      throw new BadRequestException('username นี้ถูกใช้งานแล้ว')
    }

    const hashedPassword = await this.hashPassword(register.password)

    const user: UsersMessage = {
      id: this.currentId++,
      username: register.username,
      password: hashedPassword
    };

    this.users.push(user);
    return { message: "Register Successfully" }
  }
  // * Register

  // * Login
  async getLogin(login: LoginMessage): Promise<any> {
    const user = this.users.find(u => u.username === login.username);

    if (!login.username) {
      throw new BadRequestException('กรุณากรอง username')
    }
    if (!login.password) {
      throw new BadRequestException('กรุณากรอง password')
    }

    if (!user) {
      throw new BadRequestException('ไม่พบผู้ใช้งาน')
    }

    const isPasswordValid = await this.comparePasswords(login.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('รหัสผ่านไม่ถูกต้อง')
    }

    return [
      {
        message: "เข้าสู่ระบบสำเร็จ"
      },
      {
        token: `${user.id}`
      }
    ]
  }
  // * Login

  // * Update
  getUpdatePassword(updatePassword: UpdatePasswordMessage): any {
    const userIndex = this.users.findIndex((u) => u.username === updatePassword.username);

    if (!updatePassword.username) {
      throw new BadRequestException('กรุณากรอง username');
    }

    if (!updatePassword.oldPassword) {
      throw new BadRequestException('กรุณากรองรหัสผ่านเดิม');
    }

    if (!updatePassword.newPassword) {
      throw new BadRequestException('กรุณากรองรหัสผ่านใหม่');
    }

    if (userIndex === -1) {
      throw new BadRequestException('ไม่พบผู้ใช้งาน');
    }

    const user = this.users[userIndex];
    if (user.password !== updatePassword.oldPassword) {
      throw new BadRequestException('รหัสผ่านเดิมไม่ถูกต้อง')
    }

    this.validateRegister(updatePassword.newPassword)

    user.password = updatePassword.newPassword;
    return { message: 'อัปเดตรหัสผ่านสำเร็จ' };
  }
  // * Update

  // * Delete
  getDelete(username: string): any {
    const userIndex = this.users.findIndex((u) => u.username === username)

    if (userIndex === -1) {
      throw new BadRequestException('ไม่พบผู้ใช้งาน')
    } else {
      this.users.splice(userIndex, 1)
      return { message: 'ลบผู้ใช้งานสำเร็จ' };
    }
  }
  // * Delete
}
