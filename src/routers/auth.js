import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
} from '../validation/auth.js';
import {
  loginUserController,
  logOutUserController,
  refreshUserSessionController,
  registerUserController,
  requestResetEmailController,
} from '../controllers/auth.js';

const router = new Router();

//----------------------------------------------------------------------

router.post(
  '/register',
  validateBody(registerUserSchema),
  registerUserController,
);

//---------------------------------------------------------------------

router.post('/login', validateBody(loginUserSchema), loginUserController);

//---------------------------------------------------------------------

router.post('/logout', logOutUserController);

//---------------------------------------------------------------------

router.post('/refresh', refreshUserSessionController);

//---------------------------------------------------------------------

router.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  requestResetEmailController,
);

//---------------------------------------------------------------------
//=====================================================================

export default router;
