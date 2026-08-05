import express from 'express';
import { generateSystemReport } from '../controllers/ReportController.js';

const router = express.Router();


router.get('/', generateSystemReport);

export default router;