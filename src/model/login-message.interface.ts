/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
export class LoginMessage {
  @ApiProperty()
  username: string
  @ApiProperty()
  password: string
}