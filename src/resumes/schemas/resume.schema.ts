import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import MongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';
import { Company } from 'src/companies/schemas/company.schema';
import { Job } from 'src/jobs/schemas/job.schema';
// export type ResumeDocument = HydratedDocument<Resume>;
@Schema({ timestamps: true })
export class Resume {

  @Prop()
  email: string;

  @Prop()
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  url: string;

  @Prop()
  status: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Job.name})
  jobId: mongoose.Schema.Types.ObjectId;

  @Prop({type : mongoose.Schema.Types.Array})
  history: {
    updateAt: Date,
    updateBy: {
      _id: mongoose.Schema.Types.ObjectId,
      email: string
    }
  }[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({type: Object})
  createdBy:{
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  };
  
  @Prop({type: Object})
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  };

  @Prop({type: Object})
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
export type ResumeDocument = Resume & Document & SoftDeleteDocument;

// Extend Model với SoftDeleteModel
export type ResumeModel = SoftDeleteModel<ResumeDocument>;

export const ResumeSchema = SchemaFactory.createForClass(Resume);

// Thêm plugin mongoose-delete
ResumeSchema.plugin(MongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: 'all',
  indexFields: ['deleted', 'deletedAt']
});

