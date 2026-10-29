import "dotenv/config";
import { Mistral } from "@mistralai/mistralai";
import { parse } from "dotenv";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

const agent = await client.beta.agents.create({
  model: "mistral-medium-latest",
  name: "Image Generation Agent",
  description: "Generates images from user prompts",
  instructions:
    "Use the image generation tool when the user requests an image.",
  tools: [{ type: "image_generation" }],
  completionArgs: {
    temperature: 0.3,
    topP: 0.95,
  },
});

console.log("Agent ID:", agent.id);

const response = await client.beta.conversations.start({
  agentId: agent.id,
  inputs: "Generate a cyberpunk samurai in a dark futuristic city.",
});

const imageToolOutput=response.outputs.find((output)=>output.name="image_generation")

const result=JSON.parse(imageToolOutput.info.result)

const imageUrl=result.url

console.log("ImageUrl",imageUrl)
