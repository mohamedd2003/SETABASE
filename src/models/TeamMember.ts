import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/**
 * A dashboard account. Passwords are stored as bcrypt hashes; `tokenVersion` goes up
 * whenever the password changes, which ends every session issued before the change.
 */
const TeamMemberSchema = new Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    tokenVersion: { type: Number, default: 0 },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export type TeamMemberDoc = InferSchemaType<typeof TeamMemberSchema>;

export const TeamMemberModel =
  (mongoose.models.TeamMember as Model<TeamMemberDoc> | undefined) ??
  mongoose.model<TeamMemberDoc>("TeamMember", TeamMemberSchema);
