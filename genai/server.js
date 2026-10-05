import dotenv from "dotenv";
// import { Mistral } from "@mistralai/mistralai"
import { ChatMistralAI } from "@langchain/mistralai";
dotenv.config();
import readline from "readline/promises";
import * as z from "zod";
import fs from "fs/promises";

import { AIMessage, HumanMessage, tool, createAgent } from "langchain";

// const mistral = new Mistral({

//   apiKey: process.env.MISTRAL_API_KEY,
// });
const model = new ChatMistralAI({
  model: "voxtral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
  temperature: 0,
});

const rl = await readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// const models=await mistral.models.list()

// for(let model of models.data){
//   console.log(model.id)
// }

async function readMemoryFromFIle() {
  console.log("📖 readMemory started");

  try {
    const data = await fs.readFile("./memory.md", "utf-8");
    console.log("📖 readMemory completed");
    return data;
  } catch (error) {
    if (error.code === "ENOENT") {
      return "No existing memory found.";
    }
    throw error;
  }
}

async function getCurrentDate() {
  const today = new Date();

  return today.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const currentDateTool = tool(getCurrentDate, {
  name: "getCurrentDate",
  description: "Get the current date in india",
  schema: z.object({}),
});

const readMemory = tool(readMemoryFromFIle, {
  name: "readMemory",
  description: "Read the memory from the file and  return it as strings",
  schema: z.object({}),
});

async function updateMemoryFromFile({ newMemory }) {
  console.log("✍️ updateMemory started");
  console.log("Content to save:", newMemory);

  await fs.writeFile("./memory.md", newMemory, "utf-8");

  console.log("✅ updateMemory completed");
  return "Memory updated successfully";
}

const updateMemory = tool(updateMemoryFromFile, {
  name: "updateMemory",
  description: "Updates the memory in the file with new content.",
  schema: z.object({
    newMemory: z
      .string()
      .describe("The new memory content to be overwrite to the file."),
  }),
});

const agent = createAgent({
  model,
  tools: [readMemory, updateMemory, currentDateTool],
  systemPrompt: `
You are a helpful personal assistant with persistent memory.

You can read and update the user's memory using tools.

Memory rules:
1. Read memory when relevant information may already exist.
2. Save useful personal facts, interests, preferences, long-term goals,
   education, career details, and ongoing projects.
3. When the user shares a new useful personal fact, save it during
   the same interaction. Do not merely acknowledge it.
4. Before saving, always call readMemory.
5. Preserve all existing useful information.
6. Merge the new information with existing memory.
7. Use updateMemory to save the complete updated memory.
8. Do not save temporary, irrelevant, or sensitive information.
9. After saving, respond naturally and confirm only if the tool succeeds.
10.Use getCurrentDate when the user asks for today's date or needs the current date to answer a question, Always use the tool for current-date queries.
`,
});

const messages = [];

while (true) {
  let userPrompt = await rl.question("ask me: ");

  messages.push(new HumanMessage(userPrompt));

  const response = await agent.invoke({
    messages,
  });

  const lastMessage = response.messages.at(-1);
  messages.push(new AIMessage(lastMessage.content));

  console.log("Response:", lastMessage.content);
}
