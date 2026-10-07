import { ChatMistralAI } from "@langchain/mistralai";
import { env } from "../config/env";
import * as z from "zod";
import { AIMessage, createAgent, HumanMessage, ToolMessage } from "langchain";
import { MongoMessage } from "../types/chat";
import { getWebResultTool, readMemoryTool, updateMemoryTool } from "./ai/tool";

const smallModel = new ChatMistralAI({
  model: "codestral-2508",
  apiKey: env.mistralApiKey,
});
const mediumModel = new ChatMistralAI({
  model: "codestral-latest",
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

// testtolls for checking the agenty working properly or not

// ---end---  //
export async function getStream({
  messages,
  userId,
}: {
  messages: MongoMessage[];
  userId: string;
}): Promise<ReadableStream> {
  const agent = createAgent({
    model: smallModel,
    tools: [readMemoryTool, updateMemoryTool, getWebResultTool],
    systemPrompt: `
You are a helpful conversational assistant.

You have access to two memory tools:

1. getMemory
   - Use this to retrieve previously stored long-term information about the user.

2. updateMemory
   - Use this only when the user provides a new fact that is likely to remain useful for weeks or months.

3. getWebResult   
  - Use the web search tool to look up information on the web when you don't know the answer to a question. Always use the web search tool when you are unsure about an answer. If you find relevant information, use it to respond to the user. If you don't find relevant information, respond with "I couldn't find any relevant information on that topic."

Memory rules:
- Use getMemory when previous user context is useful for answering the current request.
- Use updateMemory only when there is genuinely new long-term information.
- Do not update memory for temporary information, questions, opinions, or normal conversation.
- Do not repeatedly call the same memory tool for the same request.
- Do not call getMemory again after updateMemory unless it is genuinely necessary.
- Once the necessary memory operations are complete, answer the user directly.
 Current Date: ${new Date().toISOString().split("T")[0]}
`,
  });

  const stream = await agent.stream(
    {
      messages: messages.map((message) => {
        if (message.author === "user") {
          return new HumanMessage(message.content);
        } else if (message.author === "ai") {
          return new AIMessage({
            content: message.content,
            tool_calls: message.toolCalls?.map((toolCall) => ({
              name: toolCall.name || "",
              args: toolCall.arguments || {},
              id: toolCall.id || "",
            })),
          });
        } else {
          return new ToolMessage({
            content: message.content,
            tool_call_id: message.toolCallId || "",
          });
        }
      }),
    },
    {
      streamMode: ["messages", "values"],
      configurable: {
        userId: userId,
      },
    },
  );
  return stream;
}
