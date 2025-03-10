import mongoose, { Document, Schema } from 'mongoose';
import { User as UserType } from '@shared/schema';

// Define the User document interface extending both Document and UserType
export interface UserDocument extends Document, Omit<UserType, 'id'> {}

// Create the User schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  // This will automatically convert MongoDB's _id to id in the response
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Create and export the User model
export const User = mongoose.model<UserDocument>('User', UserSchema);