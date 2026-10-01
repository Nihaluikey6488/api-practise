import dotenv from "dotenv";
dotenv.config();
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
const userPrompt = "Hello, tell me about rag fullform";
const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey: process.env.MISTRAL_API_KEY,
});

const vectors = await embeddings.embedQuery(userPrompt);

const index = await pc.index("kodex-rag");

const response = await index.query({
  vector: vectors,
  includeMetadata: true,
  topK: 5,
});

console.log(response.matches)

const context = response.matches
  .map((match) => match.metadata.text)
  .join("\n\n");

const ai = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-3.8-flash",
});

const aiResponse = await ai.invoke([
  new SystemMessage(`
         You are a helpful RAG assistant.

    Answer the user's question using the provided context.

    Context:
    ${context}

    If the answer cannot be found in the context,
    say that you don't have enough information.
        `),
  new HumanMessage(userPrompt),
]);

console.log(aiResponse.text);
