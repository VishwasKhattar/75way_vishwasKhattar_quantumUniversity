// Controller handling the start exam functionality

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

const startExam = async (req: Request, res: Response) => {
    const { examId } = req.body;

    // Check if required fields are present
    if (!examId) {
        res.status(400).json({ message: "Exam ID is required" });
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

        // Check if the user has already started the exam
        const userAnswer = exam.userAnswers.find((ua) => ua.userId === id);

        if (userAnswer && userAnswer.startTime) {
            return res.status(400).json({ message: 'Exam already started' });
        }

        // Save start time to the exam state
        const startTime = new Date().getTime();
        const expirationTime = startTime + exam.duration * 60 * 1000; // Calculating expiration time based on duration

        if (!userAnswer) {
            exam.userAnswers.push({
                userId: id,
                answers: [], // Add an empty array for answers
                startTime,
                expirationTime,
            });
        } else {
            userAnswer.startTime = startTime;
            userAnswer.expirationTime = expirationTime;
        }

        // Save the updated exam document
        const savedExam = await exam.save();

        // Returning the saved exam data
        res.status(200).json(savedExam);
    } catch (error) {
        console.error('Error starting exam:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default startExam;
