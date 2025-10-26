import { Type } from "class-transformer";
import { IsDefined, IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, ValidateNested } from "class-validator";
import mongoose, { Mongoose } from "mongoose";


class Company{
    @IsNotEmpty({message: "company_id không được trống"})
    _id: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty({message: "company email không được trống"})
    name: string
}
export class CreateUserDto {
    @IsNotEmpty({message: "name không được trống"})
    name: string;
    @IsEmail({},{message: "email không đúng định dạng"})
    @IsNotEmpty({message: "email không được trống 11"})
    @IsOptional()
    email?: string;
    @IsNotEmpty({message: "password không được trống"})
    password: string;
    @IsNotEmpty({message: "age không được trống"})
    age: number;
    @IsNotEmpty({message: "gender không được trONGL"})
    gender: string;
    @IsNotEmpty({message: "address không được trống"})
    address: string;
    @IsNotEmpty({message: "role không được trống"})
    @IsMongoId({message: "role khong dung dinh dang"})
    role: mongoose.Schema.Types.ObjectId;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company!: Company;

}

export class RegisterUserDto {
    @IsNotEmpty({message: "name không được trống"})
    name: string;
    @IsEmail({},{message: "email không đúng định dạng"})
    @IsNotEmpty({
        message: "email không được trống"
    })
    email: string;
    @IsNotEmpty({message: "password không được trống"})
    password: string;
    @IsNotEmpty({message: "age không được trống"})
    age: number;
    @IsNotEmpty({message: "gender không được trONGL"})
    gender: string;
    @IsNotEmpty({message: "address không được trống"})
    address: string;

}

