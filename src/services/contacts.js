import { contactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await contactsCollection.find();
  return contacts;
};

export const getContactByID = async (id) => {
  const contact = await contactsCollection.findById(id);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await contactsCollection.create(payload);
  return contact;
};

export const deleteContactbyID = async (id) => {
  const contact = await contactsCollection.findByIdAndDelete(id);
  return contact;
};

export const updateContact = async (id, payLoad, options = {}) => {
  const updatedContact = await contactsCollection.findOneAndUpdate(
    { _id: id },
    payLoad,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!updatedContact || !updatedContact.value) return null;

  return {
    contact: updatedContact.value,
    isNew: Boolean(updatedContact.lastErrorObject.upserted),
  };
};
