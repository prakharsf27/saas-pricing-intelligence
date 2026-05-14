import mongoose, { Document } from 'mongoose';
export interface ISaaSData extends Document {
    companyName: string;
    planName: string;
    price: number | null;
    currency: string | null;
    billingCycle: string | null;
    features: string[];
    hasFreeTrial: boolean;
    lastUpdated: Date;
}
declare const _default: mongoose.Model<ISaaSData, {}, {}, {}, mongoose.Document<unknown, {}, ISaaSData, {}, mongoose.DefaultSchemaOptions> & ISaaSData & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISaaSData>;
export default _default;
//# sourceMappingURL=SaaSData.d.ts.map