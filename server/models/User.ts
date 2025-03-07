import mongoose, { Document, Schema } from 'mongoose';
import { User as UserType } from '@shared/schema';

// Define the User document interface extending both Document and UserType
export interface UserDocument extends Document, Omit<UserType, 'id'> {
  // The id field is handled by MongoDB's _id
  isAdmin?: boolean;
}

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
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
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