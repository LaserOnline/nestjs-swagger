/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
export class RegisterMessage {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  password_verify: string;
}
