import { model, Schema, InferSchemaType, Types } from "mongoose";
const MessageSchema=new Schema({
    conversation:{
    type:Schema.Types.ObjectId,
    ref:"Conversation",
    required:true,
    index:true
    },
    author:{
        type:String,
        enum:["user","ai","tool"],
        default:"user"
    },
    content:{
        type:String,
        required:true,
        trim:true,
        minlength:1

    },
    toolCalls:[
        {
            argments:Object,
            id:String,
            name:String
            
            

        }
    ],
    toolCallId: String,
    
},{
    timestamps:true
})

export type MessageDocument=InferSchemaType<typeof MessageSchema> & {
    _id:Types.ObjectId;
}
export const MessageModel=model("Message",MessageSchema)
