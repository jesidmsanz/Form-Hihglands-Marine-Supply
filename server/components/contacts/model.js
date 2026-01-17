import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    // Campos originales
    Subject: {
      type: String,
      required: false,
      comment: 'Subject',
      default: undefined,
    },
    Procedures: {
      type: String,
      required: false,
      comment: 'Procedures',
      default: undefined,
    },
    fullName: {
      type: String,
      required: false,
      comment: 'fullName',
      default: undefined,
    },
    email: {
      type: String,
      required: false,
      comment: 'Email',
      default: undefined,
    },
    phone: {
      type: String,
      required: false,
      comment: 'Phone',
      default: undefined,
    },
    message: {
      type: String,
      required: false,
      comment: 'Message',
      default: undefined,
    },
    ipAddress: {
      type: String,
      required: false,
      comment: 'IP Address',
      default: undefined,
    },
    url: {
      type: String,
      required: false,
      comment: 'Url',
      default: undefined,
    },
    sendInformation: {
      type: Boolean,
      required: false,
      comment: 'Send information and offers from the website',
      default: undefined,
    },
    // Nuevos campos para Landing Page
    firstName: {
      type: String,
      required: false,
      comment: 'First Name',
      default: undefined,
    },
    lastName: {
      type: String,
      required: false,
      comment: 'Last Name',
      default: undefined,
    },
    company: {
      type: String,
      required: false,
      comment: 'Company',
      default: undefined,
    },
    vessel: {
      type: String,
      required: false,
      comment: 'Vessel',
      default: undefined,
    },
    arrivalDate: {
      type: Date,
      required: false,
      comment: 'Estimated Arrival Date',
      default: undefined,
    },
    departureDate: {
      type: Date,
      required: false,
      comment: 'Estimated Departure Date',
      default: undefined,
    },
    port: {
      type: String,
      required: false,
      comment: 'Port of Arrival',
      default: undefined,
    },
    vesselCategory: {
      type: String,
      required: false,
      comment: 'Vessel Category',
      // Removed enum validation to allow flexibility with pipe character
      default: undefined,
    },
    request: {
      type: String,
      required: false,
      comment: 'Request/Inquiry',
      default: undefined,
    },
    code: {
      type: [String],
      required: false,
      comment: 'Code',
      default: undefined,
    },
    description: {
      type: [String],
      required: false,
      comment: 'Description',
      default: undefined,
    },
    unit: {
      type: [String],
      required: false,
      comment: 'Unit',
      default: undefined,
    },
    quantity: {
      type: [String],
      required: false,
      comment: 'Quantity',
      default: undefined,
    },
    items: {
      type: [{
        code: String,
        description: String,
        unit: String,
        quantity: String,
      }],
      required: false,
      comment: 'Items array with code, description, unit and quantity',
      default: undefined,
    },
    agent: {
      type: String,
      required: false,
      comment: 'Agent',
      default: undefined,
    },
    comment: {
      type: String,
      required: false,
      comment: 'Comment',
      default: undefined,
    },
    attachments: {
      type: [String],
      required: false,
      comment: 'File attachments URLs',
      default: undefined,
    },
    createdAt: {
      type: Date,
      required: false,
      comment: 'created At',
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      required: false,
      comment: 'updated At',
      default: Date.now,
    },
  },
  {
    strict: true,
    minimize: true,
  }
);

if (mongoose.models.contacts) {
  delete mongoose.models.contacts;
}

export const Contact = mongoose.model('contacts', ContactSchema);
