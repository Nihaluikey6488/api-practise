import dotenv from 'dotenv'
dotenv.config()
import { MistralAIEmbeddings ,ChatMistralAI } from "@langchain/mistralai";
import {Pinecone} from "@pinecone-database/pinecone"
import {SystemMessage,HumanMessage} from "langchain"

const userPrompt='Explain machine coding round question'

const pc=new Pinecone({
    apiKey:process.env.PINECONE_API_KEY
})
const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey: process.env.MISTRAL_API_KEY,
});

const vector = await embeddings.embedQuery(userPrompt);

const index = pc.index("kodex-rag")

const response=await index.query({
    vector:vector,
    includeMetadata:true,
    topK:2
})

console.log(response.matches)


// console.log("mistral apiKey:",process.env.MISTRAL_API_KEY)
const mistralSmall=new ChatMistralAI({
    model:"mistral-small-2603",
    apiKey:process.env.MISTRAL_API_KEY
})


const aiResponse=await mistralSmall.invoke([
    new SystemMessage(`
        context:${response.matches.map(match=>match.metadata.text).join("\n\n")}`),

        new HumanMessage(userPrompt)

])



console.log(aiResponse.content)