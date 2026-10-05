import { conversationDao } from "../dao/conversation.dao.js";
import { messageDao } from "../dao/message.dao.js";
import { getConversationTitle, getStream } from "../service/ai.service.js";
import { RequestMessage } from "../types/chat.js";
import { asyncHandler } from "../utils/async-handlers.js";
import { Request, Response } from "express";
export const chatController = asyncHandler(
  async (
    req: Request<{}, {}, RequestMessage>,
    res: Response,
  ): Promise<void> => {
    let { message, conversationId } = req.body;
    let user = req.user;

    if (!user) {
        
      return res.status(401).json({ error: "unAuthorized" });
    }

    if (!conversationId) {
      const title = await getConversationTitle({ message });
      const newConversation = await conversationDao.createConversation({
        user: user.userId,
        title,
      });
      conversationId = newConversation._id.toString();
    }

    await messageDao.createMessage({
      content: message,
      author: "user",
      conversation: conversationId,
    });

    const stream = await getStream({ message });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let aiMessage: string = "";

    for await (const chunk of stream) {
      res.write(`data: ${chunk.text}\n\n`);
      aiMessage += chunk.text;
    }
    res.end();

    await messageDao.createMessage({
      content: aiMessage,
      author: "ai",
      conversation: conversationId,
    });
  },
);
