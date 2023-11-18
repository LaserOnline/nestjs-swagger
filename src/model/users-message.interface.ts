/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
export class UsersMessage {
    @ApiProperty()
    id:number
    @ApiProperty()
    username:string
    @ApiProperty()
    password:string
}
