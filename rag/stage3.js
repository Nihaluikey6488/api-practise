import dotenv from "dotenv";
dotenv.config();

import {GoogleGenAI} from "@google/genai"

const ai=new GoogleGenAI({
  apiKey:process.env.GEMINI_API_KEY
})

// const response = await ai.models.generateContent({
//   model:"gemini-3.7-flash",
//   contents:"Hello, explain rag in one sentence"
// })
// try {

//   console.log("SUCCESS:");
//   console.log(response.text);
// } catch (error) {
//   console.log("STATUS:", error.statusCode);
//   console.log("MESSAGE:", error.message);
//   console.log("BODY:", error.body);
// }


async function generateWithRetry() {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await ai.interactions.create({
        model: "gemini-3.8-flash",
        input: "Hello, tell me about apple",
      });

      return response.output_text;

    } catch (error) {
      console.log(`Attempt ${attempt + 1} failed`);
      console.log(error.message);

      if (attempt === 2) {
        throw error;
      }

      const delay = 2000 * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

const answer = await generateWithRetry();
console.log(answer);
