import { ContextModel, ContextDocument } from "./models/context.model";

class ContextDao {
  async readContextByUser({ userId }: { userId: string }): Promise<string> {
    const contextDoc: ContextDocument | null = await ContextModel.findOne({
      user: userId,
    }).lean();
    if (contextDoc) {
      return contextDoc.description;
    } else {
      return "No context found from the user";
    }
  }

  async updateContextByUser({
    userId,
    description,
  }: {
    userId: string;
    description: string;
  }): Promise<string> {
    const contextDoc: ContextDocument | null =
      await ContextModel.findOneAndUpdate(
        { user: userId },
        { description },
        { new: true, upsert: true },
      );
    return "Context updated successfully.";
  }
}

export const contextDao = new ContextDao();
