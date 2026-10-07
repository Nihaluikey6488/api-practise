import { Message, MongoMessage } from "../types/chat.js";
import { MessageModel, type MessageDocument } from "./models/message.model.js";

class MessageDao {
  async createMessage(messageData: Message): Promise<void | MessageDocument> {
    const { author, content, conversation } = messageData;

    const message = await MessageModel.create({
      content,
      author,
      conversation,
      toolCallId:messageData.toolCallId,
      toolCalls:messageData.toolCalls,
    });
  }

  async findMessagesByConversation(
    conversation: string,
  ): Promise<MongoMessage[]> {
    return (
      await MessageModel.find({ conversation }).sort({ createdAt: 1 }).lean()
    ).map((message) => ({
      _id: String(message._id),
      content: message.content,
      author: message.author,
      conversation: message.conversation.toString(),
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      toolCallId:message.toolCallId,
      toolCalls:message.toolCalls
    }));
  }
}
export const messageDao = new MessageDao();
