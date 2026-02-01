import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  sanadId: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true }, // Hashed password
  paidAmount: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  paymentDate: { type: Date },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);

const HelpRequestSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Link to user
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

export const HelpRequest = models.HelpRequest || model('HelpRequest', HelpRequestSchema);

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
}, { timestamps: true });

export const Admin = models.Admin || model('Admin', AdminSchema);

