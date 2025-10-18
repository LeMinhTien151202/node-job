import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty({ message: 'name không được để trống' })
            name: string;
            @IsNotEmpty({ message: 'apiPath không được để trống' })
            description: string;
            @IsNotEmpty({ message: 'method không được để trống' })
            @IsBoolean({ message: 'active không đúng định dạng' })
            isActive: boolean;
            
            @IsNotEmpty({ message: 'module khong duoc de trong' })
            @IsMongoId({message: 'môngId khong dung dinh dang'})
            @IsArray({message: ' khong phai mang'})
            permissions: mongoose.Schema.Types.ObjectId;
}
