import { model, Schema, Types } from 'mongoose';

const contactSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'users',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: false,
    },

    isFavourite: {
      type: Boolean,
      required: true,
      default: false,
    },

    contactType: {
      type: String,
      required: true,
      enum: ['work', 'home', 'personal'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const contactsCollection = model('contacts', contactSchema);
