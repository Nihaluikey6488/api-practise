import { ChatMistralAI } from "@langchain/mistralai";
import { env } from "../config/env";
import * as z from "zod";
import { createAgent, HumanMessage } from "langchain";

const smallModel = new ChatMistralAI({
  model: "codestral-latest",
  apiKey: env.mistralApiKey,
});
const mediumModel = new ChatMistralAI({
  model: "codestral-2508",
  apiKey: env.mistralApiKey,
});


export async function getConversationTitle({
  message,
}: {
  message: string;
}): Promise<string> {
  const agent = createAgent({
    model: smallModel,
    responseFormat: z.object({
      title: z
        .string()
        .max(30)
        .describe("The title of conversation, max 30 characters"),
    }),
    systemPrompt: `You are an assistant that generates a  concise title  for a conversation based on user's first message.`,
  });

  const response = await agent.invoke({
    messages: [new HumanMessage(message)],
  });
  return response.structuredResponse.title;
}


export async function getStream({message,}:{message:string}):Promise<ReadableStream>{
    const stream=await mediumModel.stream(message)
    return stream;

}