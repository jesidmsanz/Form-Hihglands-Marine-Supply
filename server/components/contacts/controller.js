import { connectDB } from '@/lib/db';
import { Contact } from '@/server/components/contacts/model';
const recaptcha = require('@/utils/recaptcha');

async function findAll() {
  await connectDB();
  const result = await Contact.find().sort({ createdAt: -1 });
  return result;
}

async function findAllActive() {
  try {
    await connectDB();
    const result = await Contact.find({ active: true }).sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    throw error;
  }
}

async function findById(id) {
  await connectDB();
  const result = await Contact.findById(id);
  return result;
}

async function deleteById(id) {
  try {
    await connectDB();
    const result = await Contact.deleteOne({ _id: id });
    return result;
  } catch (err) {
    throw err;
  }
}

async function create(obj) {
  try {
    await connectDB();
    const isValidCaptcha = await recaptcha.validate(obj.token);
    if (!isValidCaptcha) {
      throw new Error('Captcha error');
    }

    const newContact = new Contact(obj);
    const result = await newContact.save();
    return result;
  } catch (err) {
    throw err;
  }
}

async function update(id, form) {
  try {
    await connectDB();

    const filteredForm = Object.keys(form).reduce((acc, key) => {
      const value = form[key];
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    const result = await Contact.findByIdAndUpdate(id, filteredForm, { new: true });
    return result;
  } catch (err) {
    throw err;
  }
}

const controllerContacts = {
  findAll,
  findAllActive,
  create,
  findById,
  deleteById,
  update,
};
export default controllerContacts;
