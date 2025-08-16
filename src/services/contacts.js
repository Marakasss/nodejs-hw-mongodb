import createHttpError from 'http-errors';
import { contactsCollection } from '../db/models/contacts.js';

const createPaginationMetadata = (page, perPage, totalItems) => {
  const totalPages = Math.ceil(totalItems / perPage);
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

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filters = {},
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
    .find()
    .merge(filtersConditions)
    .limit(perPage)
    .skip(skip)
    .sort({ [sortBy]: sortOrder });
  const contactsCount = await contactsCollection
    .find()
    .merge(filtersConditions)
    .countDocuments();

  if (contacts.length === 0) {
    throw createHttpError(404, 'No contacts found for given filters');
  }

  return {
    contacts,
    ...createPaginationMetadata(page, perPage, contactsCount),
  };
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
