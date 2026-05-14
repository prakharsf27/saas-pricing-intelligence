import mongoose, { Schema, Document } from 'mongoose';

// This is our Data Blueprint (Schema)
// It tells MongoDB exactly what a "Pricing Plan" should look like.
export interface ISaaSData extends Document {
  companyName: string;   // e.g. "Slack"
  planName: string;      // e.g. "Pro Plan"
  price: number | null;  // e.g. 15.00
  currency: string | null; // e.g. "USD"
  billingCycle: string | null; // e.g. "monthly"
  features: string[];     // e.g. ["Unlimited messages", "History"]
  hasFreeTrial: boolean;
  lastUpdated: Date;
}

const SaaSDataSchema: Schema = new Schema({
  companyName: { type: String, required: true },
  planName: { type: String, required: true },
  price: { type: Number, default: null },
  currency: { type: String, default: null },
  billingCycle: { type: String, default: null },
  features: { type: [String], default: [] },
  hasFreeTrial: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model<ISaaSData>('SaaSData', SaaSDataSchema);
