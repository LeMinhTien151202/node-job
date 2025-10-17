import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import MongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';

// export type UserDocument = HydratedDocument<User>;
//bật time stamp câp nhật createdAt, updatedAt
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop({type: Object})
  company:  {
      _id: mongoose.Schema.Types.ObjectId,
      email: string
    };

  @Prop()
  role: string;

  @Prop()
  refreshToken: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  };
  

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;

}
// Extend Document với SoftDeleteDocument
export type UserDocument = User & Document & SoftDeleteDocument;

// Extend Model với SoftDeleteModel
export type UserModel = SoftDeleteModel<UserDocument>;

export const UserSchema = SchemaFactory.createForClass(User);

// Thêm plugin mongoose-delete
UserSchema.plugin(MongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: 'all',
  indexFields: ['deleted', 'deletedAt']
});
