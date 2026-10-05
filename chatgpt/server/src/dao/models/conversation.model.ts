import { model, Schema, InferSchemaType, Types } from "mongoose";
const ConversationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);
export type ConversationDocument = InferSchemaType<
  typeof ConversationSchema
> & {
  _id: Types.ObjectId;
};

export const ConversationModel = model("Conversation", ConversationSchema);
