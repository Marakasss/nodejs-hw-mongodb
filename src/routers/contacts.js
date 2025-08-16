import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
  putContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import { getContactsParamsValidationSchema } from '../validation/getContactsParamsValidationSchema.js';

const router = new Router();

router.get(
  '/contacts',
  validateQuery(getContactsParamsValidationSchema),
  getContactsController,
);

router.get('/contacts/:contactId', isValidId, getContactByIdController);

router.post(
  '/contacts',
  validateBody(createContactSchema),
  createContactController,
);

router.delete('/contacts/:contactId', isValidId, deleteContactController);

router.put(
  '/contacts/:contactId',
  isValidId,
  validateBody(createContactSchema),
  putContactController,
);

router.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  patchContactController,
);

export default router;
