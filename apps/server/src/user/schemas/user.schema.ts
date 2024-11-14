import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Query } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User extends Document {
  @Prop({
    type: String,
    required: [true, 'A fname must be given'],
    trim: true,
    minlength: [3, 'A fname must be at least 3 characters long'],
  })
  fname: string;

  @Prop({
    type: String,
    required: [true, 'A lname must be given'],
    trim: true,
    minlength: [3, 'A lname must be at least 3 characters long'],
  })
  lname: string;

  @Prop({
    type: String,
    required: [true, 'An email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v: string) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v); // Regular expression for email validation
      },
      message: 'Email is invalid',
    },
  })
  email: string;

  @Prop({
    type: String,
    trim: true,
    default: 'default.jpg',
  })
  photo: string;

  @Prop({
    type: String,
    enum: ['user', 'guide', 'admin'],
    default: 'user',
  })
  role: string;

  @Prop({
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be atleast 8 characters long'],
    select: false,
  })
  password: string;

  @Prop()
  passwordChangedAt?: Date;

  @Prop()
  accountConfirmToken?: string;

  @Prop()
  accountExpiresIn?: Date;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpiresIn?: Date;

  @Prop({
    type: Boolean,
    default: true,
    select: false,
  })
  active: boolean;
}

export interface UserDocument extends User, Document {
  isCorrectPassword(candidatePassword: string): Promise<boolean>;
  hasPasswordChangedAfterTokenIssued(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
  createEmailConfirmToken(): string;
  correctPassword(candidatePassword: string): Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hashing the password before saving
UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 14);
  }

  if (this.isNew || !this.isModified('password')) return next();

  // Update the password changed date
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

// Query hook to exclude inactive users
UserSchema.pre<Query<UserDocument, UserDocument>>(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

/**
 *
 * \Instance methods
 */

// Check if the password is correct
UserSchema.methods.isCorrectPassword = async function (
  this: UserDocument,
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if the user has changed the password after the token was issued
UserSchema.methods.hasPasswordChangedAfterTokenIssued = function (
  this: UserDocument,
  JWTTimestamp: number
): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      `${this.passwordChangedAt.getTime() / 1000}`,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Create a password reset token
UserSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(18).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpiresIn = Date.now() + 15 * 60 * 1000; // 15 mins
  return resetToken;
};

// Create a confirm token when user signs up
UserSchema.methods.createEmailConfirmToken = function (): string {
  const confirmToken = crypto.randomBytes(18).toString('hex');
  this.accountConfirmToken = crypto
    .createHash('sha256')
    .update(confirmToken)
    .digest('hex');
  this.accountExpiresIn = Date.now() + 60 * 24 * 60 * 60 * 1000; // 60 days
  return confirmToken;
};
