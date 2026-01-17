import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      comment: 'Code',
    },
    username: {
      type: String,
      required: true,
      comment: 'Username',
    },
    email: {
      type: String,
      required: false,
      comment: 'email',
    },
    password: {
      type: String,
      required: true,
      comment: 'Password',
    },
    firstName: {
      type: String,
      required: true,
      comment: 'firstName',
    },
    lastName: {
      type: String,
      required: false,
      comment: 'lastName',
    },
    roles: {
      type: [String],
      required: false,
      comment: 'roles',
    },
    createdAt: {
      type: Date,
      required: false,
      comment: 'created At',
    },
    updatedAt: {
      type: Date,
      required: false,
      comment: 'updated At',
    },
  },
  { id: true }
);

if (mongoose.models.users) {
  delete mongoose.models.users;
}
export const User = mongoose.model('users', UserSchema);
