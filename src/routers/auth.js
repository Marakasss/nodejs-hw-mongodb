import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';
import {
  loginUserController,
  logOutUserController,
  refreshUserSessionController,
  registerUserController,
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

export default router;
