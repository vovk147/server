import 'dotenv/config'
import express from "express";
import mongoose from "mongoose"
import cors from "cors"
import article_router from './routes/article.routes.js';
import routerUser from './routes/user.routes.js';
import checkApiKey from './middlewares/apikey.js';

import path from 'path';
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))



app.use(checkApiKey)
app.use("/articles", article_router)
app.use('/api/users', routerUser);


async function main() {
	await mongoose.connect(process.env.MONGO_DB_URL)
}

main()
	.then(() => console.log("MongoDB connected!"))
	.catch((err) => console.log(err))

app.listen(process.env.PORT, () => console.log("Server was runned on port: " + process.env.PORT))
