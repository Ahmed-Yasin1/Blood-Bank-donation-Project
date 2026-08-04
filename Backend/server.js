import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import emergencyRoutes from './routes/emergencyRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import hospitalRoutes from "./routes/hospitalRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })
await connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/emergency', emergencyRoutes)
app.use('/api/notification', notificationRoutes)
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/inventory", inventoryRoutes);


// get yar oo tijaabo ah  server-ka haduu shaqaynayo intan hakuuso baxdo
app.get('/', (req,res) => {
    res.send('Blood bank server is ok');
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
