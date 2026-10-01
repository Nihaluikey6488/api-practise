import dotenv from 'dotenv'
dotenv.config()
import fs from 'fs/promises'
import {PDFParse} from 'pdf-parse'
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters"
import {MistralAIEmbeddings} from "@langchain/mistralai"
import { Pinecone } from '@pinecone-database/pinecone'

const pc=new Pinecone({
    apiKey:process.env.PINECONE_API_KEY
})
const buffer=await fs.readFile("./doc.pdf")
const parser=new PDFParse({data:buffer})
const result=await parser.getText()



const splitter=new RecursiveCharacterTextSplitter({
    chunkSize:150,
    chunkOverlap:40
})

const texts=await splitter.splitText(result.text)


const embeddings=new MistralAIEmbeddings({
    model:"mistral-embed",
    apiKey:process.env.MISTRAL_API_KEY
})

const vectors=await embeddings.embedDocuments(texts)

const vectorsData=vectors.map((vector,index)=>({
text:texts[index],
vector:vector

}))

const index=await pc.index("kodex-rag")

const vectorsStored=await index.upsert({
    records:vectorsData.map(vec=>{
        return {
            id:`${Math.random()*100000}`,
            metadata:{
                text:vec.text
            },
            values:vec.vector
        }
    })
})


console.log(vectorsStored)
