import { Message } from "../types/chat.js";
import { MessageModel, type MessageDocument } from "./models/message.model.js";

class MessageDao {
  async createMessage(messageData: Message): Promise<void | MessageDocument> {
    const { author, content, conversation } = messageData;

    const message = await MessageModel.create({ content,author,conversation });
  }
}

export const messageDao = new MessageDao();
