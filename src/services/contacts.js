import createHttpError from 'http-errors';
import { contactsCollection } from '../db/models/contacts.js';

//---------------------------------------------------------------------------

const createPaginationMetadata = (page, perPage, totalItems) => {
  const totalPages = Math.ceil(totalItems / perPage);

  if (totalItems === 0) {
    return {
      page,
      perPage,
      totalItems,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  }

  if (page < 1 || page > totalPages) {
    throw createHttpError(400, 'Page number out of range');
  }

  return {
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: totalPages > 1 && page > 1,
    hasNextPage: totalItems > page * perPage,
  };
};

//---------------------------------------------------------------------------

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filters = {},
  userId,
}) => {
  if (!Number.isInteger(page) || page < 1) {
    throw createHttpError(400, 'Page must be a positive integer');
  }
  if (!Number.isInteger(perPage) || perPage < 1) {
    throw createHttpError(400, 'perPage must be a positive integer');
  }
  const skip = (page - 1) * perPage;
  const filtersConditions = contactsCollection.find();

  if (filters.type) {
    filtersConditions.where('contactType').equals(filters.type);
  }

  if (typeof filters.isFavourite === 'boolean') {
    filtersConditions.where('isFavourite').equals(filters.isFavourite);
  }

  const contacts = await contactsCollection
    .find({ userId })
    .merge(filtersConditions)
    .limit(perPage)
    .skip(skip)
    .sort({ [sortBy]: sortOrder });
  const contactsCount = await contactsCollection
    .find({ userId })
    .merge(filtersConditions)
    .countDocuments();

  return {
    contacts,
    ...createPaginationMetadata(page, perPage, contactsCount),
  };
};

//---------------------------------------------------------------------------

export const getContactByID = async (id, userId) => {
  const contact = await contactsCollection.findOne({ _id: id, userId });
  return contact;
};

//---------------------------------------------------------------------------

export const createContact = async (payload, userId) => {
  const contact = await contactsCollection.create({ ...payload, userId });
  return contact;
};

//---------------------------------------------------------------------------

export const deleteContactbyID = async (id, userId) => {
  const contact = await contactsCollection.findOneAndDelete({
    _id: id,
    userId,
  });
  return contact;
};

//---------------------------------------------------------------------------

export const updateContact = async (id, payLoad, userId, options = {}) => {
  const updatedContact = await contactsCollection.findOneAndUpdate(
    { _id: id, userId },
    payLoad,
    {
      new: true,
      upsert: options.upsert || false,
    },
  );

  if (!updatedContact || !updatedContact.value) return null;

  return {
    contact: updatedContact.value,
    isNew: Boolean(updatedContact.lastErrorObject.upserted),
  };
};
