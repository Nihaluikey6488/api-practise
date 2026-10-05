import {
  ConversationDocument,
  ConversationModel,
} from "./models/conversation.model";

class ConversationDao {
  async createConversation(input: {
    title: string;
    user: string;
  }): Promise<ConversationDocument> {
    const conversation = await ConversationModel.create(input);
    return conversation;
  }
}

export const conversationDao = new ConversationDao();
