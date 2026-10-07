import { Router } from "express";
import { validateRequest } from "../validators/vaildate-request.js";
import {
  conversationInValidation,
  sendMesssageValidation,
} from "../validators/chat.validation.js";
import { authUserMiddleware } from "../middlewares/auth-user.middleware.js";
import {
  chatController,
  getConversation,
  listConversations,
} from "../controllers/chat.controller.js";
const chatRouter = Router();
chatRouter.use(authUserMiddleware);

chatRouter.get("/conversations", listConversations);
chatRouter.get(
  "/conversations/:conversationId",
  conversationInValidation,
  validateRequest,
  getConversation,
);
chatRouter.post(
  "/conversation",
  sendMesssageValidation,
  validateRequest,
  chatController,
);

export default chatRouter;
