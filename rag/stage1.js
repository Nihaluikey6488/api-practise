import dotenv from "dotenv";
dotenv.config();
import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import {Pinecone} from "@pinecone-database/pinecone"


const pc=new Pinecone({
    apiKey:process.env.PINECONE_API_KEY
})
const buffer = await fs.readFile("./document.pdf");
const parser = new PDFParse({ data: buffer });
const result = await parser.getText();

const text_splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 400,
  chunkOverlap: 100,
});

const parts = await text_splitter.splitText(result.text);

const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey: process.env.MISTRAL_API_KEY,
});

const vectors = await embeddings.embedDocuments(parts);
const vectorsData=vectors.map((vector,index)=>(
    {
   text:parts[index],    
   vector: vector

}
))

const index = pc.index("kodex-rag")

const vectorsStored=await index.upsert({
    records:vectorsData.map(vec=>{
        return{
            id:`${Math.random()*100000}`,
            metadata:{
                text:vec.text
            },
            values:vec.vector
        }
    })
})



console.log(vectorsStored)