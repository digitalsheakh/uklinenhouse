import mongoose, { Schema, model, models } from "mongoose";

/**
 * Simple named counters for generating sequential, human-friendly numbers
 * (e.g. order numbers). Incremented atomically so two orders can never get
 * the same value, even under concurrent checkouts.
 */
export interface ICounter {
  _id: string; // counter name, e.g. "order"
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const Counter =
  (models.Counter as mongoose.Model<ICounter>) ||
  model<ICounter>("Counter", CounterSchema);

/** Atomically get the next value for a named counter. */
export async function nextSequence(name: string): Promise<number> {
  const doc = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return doc.seq;
}

/** Next order number, formatted like "LN-001". */
export async function nextOrderNumber(): Promise<string> {
  const seq = await nextSequence("order");
  return `LN-${String(seq).padStart(3, "0")}`;
}
