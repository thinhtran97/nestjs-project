import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ResumeDocument = HydratedDocument<Resume>;

class History {
    @Prop()
    status: string;

    @Prop()
    updatedAt: Date;

    @Prop({
        type: Object,
    })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
}

@Schema({ timestamps: true })
export class Resume {
    @Prop()
    email: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    })
    userId: mongoose.Schema.Types.ObjectId;

    @Prop()
    url: string;

    @Prop({
        default: 'PENDING',
    })
    status: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    })
    companyId: mongoose.Schema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    })
    jobId: mongoose.Schema.Types.ObjectId;

    // @Prop({
    //     type: [History],
    //     default: [],
    // })
    // history: History[];
    @Prop({ type: mongoose.Schema.Types.Array })
    history: {
        status: string;
        updatedAt: Date;
        updatedBy: {
            _id: mongoose.Schema.Types.ObjectId;
            email: string;
        };
    }[]

    @Prop({
        default: false,
    })
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;

    @Prop({
        type: Object,
    })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({
        type: Object,
    })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({
        type: Object,
    })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);