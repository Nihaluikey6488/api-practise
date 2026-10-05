import { body } from "express-validator";

export const sendMesssageValidation = [
  body("message").isString().notEmpty().withMessage("Message is required"),
  body("conversationId")
    .optional()
    .isString()
    .withMessage("Conversation id must be string")
    .isMongoId(),
];
