import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
await connectDB();

const app = express();







// get yar oo tijaabo ah  server-ka haduu shaqaynayo intan hakuuso baxdo
app.get('/', (req,res) => {
    res.send('Blood bank server is ok');
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});