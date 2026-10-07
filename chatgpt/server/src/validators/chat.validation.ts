import { body, param } from "express-validator";

export const sendMesssageValidation = [
  body("message").isString().notEmpty().withMessage("Message is required"),
  body("conversationId")
    .optional()
    .isString()
    .withMessage("Conversation id must be string")
    .isMongoId(),
];

export const conversationInValidation = [
  param("conversationId")
    .isMongoId()
    .withMessage("ConversationId must be a valid mongoDB ObjectId"),
];
