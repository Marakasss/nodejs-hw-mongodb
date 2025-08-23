import {
  createContact,
  deleteContactbyID,
  getAllContacts,
  getContactByID,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

//---------------------------------------------------------

const buildContactsFilter = (query) => {
  return {
    type: query.type,
    isFavourite: query.isFavourite,
  };
};

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts({
    page: req.validatedQuery.page,
    perPage: req.validatedQuery.perPage,
    sortBy: req.validatedQuery.sortBy,
    sortOrder: req.validatedQuery.sortOrder,
    filters: buildContactsFilter(req.validatedQuery),
    userId: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
  return;
};

//---------------------------------------------------------

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactByID(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

//---------------------------------------------------------

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body, req.user._id);

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

//---------------------------------------------------------

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContactbyID(contactId, req.user._id);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};

//---------------------------------------------------------

export const putContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const result = await updateContact(contactId, req.body, req.user._id, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.contact,
  });
};

//---------------------------------------------------------

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body, req.user._id);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};
