import * as uuid from 'uuid';
import * as bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/server/components/users/model';

async function create({ username, password, firstName, lastName, roleId }) {
  try {
    await connectDB();

    const user = {
      uuid: uuid.v4(),
      username,
      password,
      firstName,
      lastName,
    };

    const exist = await User.findOne({
      $or: [{ uuid: user.uuid }, { username: user.username }, { email: user.email }],
    }).lean();

    if (exist) {
      throw new Error('User already registered');
    }

    const newUser = new User(user);
    const resultUser = await newUser.save();

    return resultUser.toObject();
  } catch (error) {
    console.log('ERROR to create user', error);
    throw error;
  }
}

async function signUp({ email, password, firstName, lastName }) {
  try {
    await connectDB();

    const user = {
      uuid: uuid.v4(),
      username: email,
      email,
      password: bcrypt.hashSync(password, 10),
      firstName,
      lastName,
      roles: ['user'],
    };

    const exist = await User.findOne({
      $or: [{ uuid: user.uuid }, { username: user.username }, { email: user.email }],
    }).lean();

    if (exist) {
      throw new Error('User already registered');
    }

    const newUser = new User(user);
    const resultUser = await newUser.save();

    return resultUser.toObject();
  } catch (error) {
    console.log('ERROR to create user', error);
    throw error;
  }
}

async function getUser({ username }) {
  try {
    await connectDB();
    const user = await User.findOne({ username }).lean();
    return user;
  } catch (error) {
    throw error;
  }
}

async function getRoles({ username }) {
  try {
    await connectDB();
    const user = await User.findOne({ username }).lean();
    return user?.roles || [];
  } catch (error) {
    throw error;
  }
}

async function findAll() {
  await connectDB();
  const result = await User.find();
  return result;
}

async function changePassword({ id, currentPassword, newPassword }) {
  await connectDB();

  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    throw new Error('The current password does not match');
  }

  const password = bcrypt.hashSync(newPassword, 10);
  const result = await User.findByIdAndUpdate(id, { password }, { new: true });
  return result;
}

async function resetPassword({ userId, newPassword }) {
  await connectDB();
  const password = bcrypt.hashSync(newPassword, 10);
  const result = await User.findByIdAndUpdate(userId, { password }, { new: true });
  return result;
}

async function statusChange({ id, statusUserId }, user2) {
  try {
    await connectDB();

    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    user.statusUserId = statusUserId;
    user.updatedBy = user.id;
    const savedModel = await user.save();

    return { id: savedModel._id };
  } catch (error) {
    throw error;
  }
}

export { create, signUp, getUser, findAll, getRoles, changePassword, resetPassword, statusChange };

const controllerUsers = {
  create,
  signUp,
  getUser,
  findAll,
  getRoles,
  changePassword,
  resetPassword,
  statusChange,
};

export default controllerUsers;
