import { Router } from "express";
import { validateRequest } from "../validators/vaildate-request.js";
import { sendMesssageValidation } from "../validators/chat.validation.js";
import { authUserMiddleware } from "../middlewares/auth-user.middleware.js";
import { chatController } from "../controllers/chat.controller.js";
const chatRouter = Router();
chatRouter.use(authUserMiddleware)
chatRouter.post("/conversation",sendMesssageValidation,validateRequest,chatController)

export default chatRouter;
