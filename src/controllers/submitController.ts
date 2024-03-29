//Controller handling submit exam controls

import Exam from "../db/exam";
import { Request, Response } from "express";
import { jwtDecode } from "jwt-decode";
import User, { IUser } from "../db/user";

interface MyToken {
    userId: string;
    iat: number;
    exp: number;
    token: string;
}

const submitAnswers = async (req: Request, res: Response) => {
    const { examId, answers } = req.body;

    // Check if required fields are present
    if (!examId || !answers) {
        res.status(400).json({ message: "Exam ID and answers are required" });
        return;
    }

    try {
        // Find the exam by ID
        const exam = await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Getting the id of the current login user
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decodedToken = jwtDecode<MyToken>(token);
        const email = decodedToken.userId;

        const checkUser: IUser | null = await User.findOne({ email });
        const id: string = checkUser?._id!;

        // Check if the user has already submitted answers for this exam
        const userAnswerIndex = exam.userAnswers.findIndex((ua) => ua.userId === id);

        if (userAnswerIndex !== -1) {
            // User has already submitted answers
            return res.status(400).json({ message: 'Answers already submitted' });
        }

        // Save user answers and exam state to the database
        const startTime = new Date().getTime();
        const expirationTime = startTime + exam.duration * 60 * 1000; // Calculate expiration time based on duration

        exam.userAnswers.push({
            userId: id,
            answers,
            startTime,
            expirationTime,
        });

        // Saving the updated exam document
        const savedExam = await exam.save();

        // Returning the saved exam data
        res.status(200).json(savedExam);
    } catch (error) {
        console.error('Error submitting answers:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default submitAnswers;
