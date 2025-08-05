import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
  putContactController,
} from '../controllers/contacts.js';

const router = new Router();

router.get('/contacts', getContactsController);
router.get('/contacts/:contactId', getContactByIdController);
router.post('/contacts', createContactController);
router.delete('/contacts/:contactId', deleteContactController);
router.put('/contacts/:contactId', putContactController);
router.patch('/contacts/:contactId', patchContactController);

export default router;
