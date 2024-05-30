import dotenv from "dotenv"
import { app , server} from "./app.js"
import connectDB from "../db/index.js"


dotenv.config({
    path:"./.env"
})

connectDB().then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`http://localhost:${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log("MONGODB CONNECTION ERROR :: ",err)
})

