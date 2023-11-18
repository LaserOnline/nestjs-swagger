/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
export class UpdatePasswordMessage {
    @ApiProperty()
    username: string;
    @ApiProperty()
    oldPassword: string;
    @ApiProperty()
    newPassword: string;
}
