import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsDefined, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company{
    @IsNotEmpty({message: "company_id không được trống"})
    _id: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty({message: "company email không được trống"})
    name: string
}
export class CreateJobDto {
    @IsNotEmpty({message: "name không được trống"})
    name: string;

    @IsNotEmpty({message: "skill không được trống 11"})
    @IsArray({message: "skill phải là mảng"})
    @IsString({each: true})
    skills?: string[];

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company!: Company;

    location: string;
    @IsNotEmpty({message: "salary không được trống"})
    salary: number;
    @IsNotEmpty({message: "quantity không được trống"})
    quantity: number;
    @IsNotEmpty({message: "level không được trống"})
    level: string;
    @IsNotEmpty({message: "description không được trONGL"})
    description: string;
    @IsNotEmpty({message: "address không được trống"})
    @Transform(({ value }) => new Date(value))
    @IsDate({message: "startDate phải là một ngày"})
    startDate: Date;
    @IsNotEmpty({message: "address không được trống"})
     @Transform(({ value }) => new Date(value))
    @IsDate({message: "startDate phải là một ngày"})
    endDate: Date;
    isActive: boolean;
}
