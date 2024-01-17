// This is the route that is handling 
// 1. Exam Submission
// 2. Exam Creation
// 3. Start Exam
// 4. Resume Exam

import express from 'express';
import createExam from "../controllers/examController";
import submitController from "../controllers/submitController";
import startExam from "../controllers/startExamController";
import resumeExam from "../controllers/resumeExamController";
import authPage from "../middlewares/authPage";
import authCreate from '../middlewares/authCreate';

const router = express.Router();

router.post('/startExam', authPage, startExam); //route for starting exam
router.post('/resumeExam', authPage, resumeExam); // Royte for starting exam
router.post('/submitExam', authPage, submitController); //Route for submitting exam
router.post('/createExam', authPage, authCreate, createExam); //Route for creating exam


export default router;
