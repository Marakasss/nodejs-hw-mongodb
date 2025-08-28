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
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);

//---------------------------------------------------------------------------

router.get(
  '/',
  validateQuery(getContactsParamsValidationSchema),
  getContactsController,
);

//---------------------------------------------------------------------------

router.get('/:contactId', isValidId, getContactByIdController);

//---------------------------------------------------------------------------

router.post(
  '/',
  validateBody(createContactSchema),
  upload.single('photo'),
  createContactController,
);

//---------------------------------------------------------------------------

router.delete('/:contactId', isValidId, deleteContactController);

//---------------------------------------------------------------------------

router.put(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(createContactSchema),
  putContactController,
);

//---------------------------------------------------------------------------

router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  patchContactController,
);

//---------------------------------------------------------------------------

export default router;
