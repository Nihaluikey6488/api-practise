import {app} from "./app/app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

connectDb()

app.listen(env.port,()=>{
    console.log(`Server running on port ${env.port}`)
})