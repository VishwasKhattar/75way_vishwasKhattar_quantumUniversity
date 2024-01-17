//This is the route that is handling 
//1. Exam Submission
//2. Exam Creation

import express from 'express';
import createExam from "../controllers/examController";
import submitController from "../controllers/submitController";
import authPage from "../middlewares/authPage";
import authCreate from '../middlewares/authCreate';

const router = express.Router();

router.post('/submitExam', authPage , submitController);
router.post('/createExam', authPage , authCreate , createExam);

export default router;