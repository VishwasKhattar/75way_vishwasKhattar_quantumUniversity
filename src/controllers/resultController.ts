//Result Controller is used to calculate the result and display it 

import Exam , { IExam } from "../db/exam";
import { Request, Response } from "express";

const getResults = async (req: Request, res: Response) => {
    const examId = req.params.examId; 

    try {
        // Finding the exam by ID
        const exam = await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Calculating results
        const results = calculateResults(exam);

        // Responding with the results
        res.status(200).json(results);
    } catch (error) {
        console.error('Error getting results:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// function to calculate results
const calculateResults = (exam: IExam): { [key: string]: number } => {
    const results: { [key: string]: number } = {};

    exam.userAnswers.forEach((userAnswer) => {
        let score = 0;

        userAnswer.answers.forEach((answer) => {
            const question = exam.questions.find((ques) => ques.questionNumber === answer.questionNumber);

            if (question && question.correctAnswer === answer.selectedOption) {
                score += 1;
            }
            else{
                score -= .25;
            }
        });

        results[userAnswer.userId] = score;
    });

    return results;
};

export default getResults;