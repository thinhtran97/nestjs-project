
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { timestamp } from 'node_modules/rxjs/dist/types';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job {
    @Prop({ required: true })
    name: string;

    @Prop({ type: [String], default: [] })
    skills: string[];

    @Prop({
        type: {
            _id: mongoose.Schema.Types.ObjectId,
            name: String,
        },
        required: true,
    })
    company: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string;
    };

    @Prop({ required: true })
    location: string;

    @Prop({ required: true })
    salary: number;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    level: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    deletedAt: Date;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const JobSchema = SchemaFactory.createForClass(Job);
