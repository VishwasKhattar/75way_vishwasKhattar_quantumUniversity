//This controller is handling Exam Creating Controls

import Exam from "../db/exam";
import { Request, Response } from "express";

const createExam = async (req: Request, res: Response) => {
    const { questions, duration } = req.body;

    // Check if required fields are present
    if (!questions || !duration) {
        res.status(400).json({ message: "All the fields are required" });
        return;
    }

    try {

        const existingQuestion = await Exam.findOne({ "questions.questionText": questions.questionText });

        if (existingQuestion) {
            return res.status(400).json({ message: "Question already exists" });
        }

        const newExam = new Exam({
            questions,
            duration,
        });

        // Save the exam to the database
        const savedExam = await newExam.save();

        // Respond with the saved exam data
        res.status(201).json(savedExam);
    } catch (error) {
        console.error('Error creating exam:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default createExam;
