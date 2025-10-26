import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateSubscriberDto {
    @IsNotEmpty({ message: "email khong duoc de trong" })
    @IsEmail({},{message: "email khong dung dinh dang"})
    email: string;
    @IsNotEmpty({ message: "name khong duoc de trong" })
    name: string;
    @IsNotEmpty({ message: "skills khong duoc de trong" })
    skills: string[]
}
