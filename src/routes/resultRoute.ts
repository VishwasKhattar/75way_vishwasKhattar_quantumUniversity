//This is the route to perform Result Functionality

import express from 'express';
import resultController from "../controllers/resultController";
import authPage from "../middlewares/authPage";
import authCreate from '../middlewares/authCreate';

const router = express.Router();

router.get('/results/:examId', authPage , authCreate , resultController);


export default router;