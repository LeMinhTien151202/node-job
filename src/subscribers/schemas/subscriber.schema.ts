import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import MongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';
import { Permission } from 'src/permissions/schemas/permission.schema';

// export type SubscriberDocument = HydratedDocument<Subscriber>;
//bật time stamp câp nhật createdAt, updatedAt
@Schema({ timestamps: true })
export class Subscriber {
  @Prop({ required: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  skills: string[];

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
export type SubscriberDocument = Subscriber & Document & SoftDeleteDocument;

// Extend Model với SoftDeleteModel
export type SubscriberModel = SoftDeleteModel<SubscriberDocument>;

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);

// Thêm plugin mongoose-delete
SubscriberSchema.plugin(MongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: 'all',
  indexFields: ['deleted', 'deletedAt']
});



