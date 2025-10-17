import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
    @IsNotEmpty({ message: "email khong duoc de trong" })
    email: string;

    @IsNotEmpty({ message: "user_id khong duoc de trong" })
    userId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: "url khong duoc de trong" })
    url: string;

    @IsNotEmpty({ message: "status khong duoc de trong" })
    status: string;

    @IsNotEmpty({ message: "company_id khong duoc de trong" })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: "job_id khong duoc de trong" })
    jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
    @IsNotEmpty({ message: "email khong duoc de trong" })
    url: string

    @IsNotEmpty({ message: "company_id khong duoc de trong" })
    @IsMongoId({ message: "company_id khong dung dinh dang" })
    companyId: mongoose.Schema.Types.ObjectId

    @IsNotEmpty({ message: "job_id khong duoc de trong" })
    @IsMongoId({ message: "job_id khong dung dinh dang" })
    jobId: mongoose.Schema.Types.ObjectId
}