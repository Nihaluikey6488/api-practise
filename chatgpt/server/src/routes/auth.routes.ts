import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  refresh,
  register,
  resetPassword
} from "../controllers/auth.controller.js";
import {
  forgotPasswordValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation
} from "../validators/auth-validation.js";
import { validateRequest } from "../validators/vaildate-request.js";



const authRouter = Router();



/**
 * POST /api/v1/auth/register
 */
authRouter.post(
  "/register",
  registerValidation,
  validateRequest,
  register
);

authRouter.post(
  "/login",
  loginValidation,
  validateRequest,
  login
);

authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);

authRouter.post(
  "/forgot-password",
  forgotPasswordValidation,
    validateRequest,
    forgotPassword
);

authRouter.post(
  "/reset-password",
  resetPasswordValidation,
  validateRequest,
  resetPassword
);

export default authRouter