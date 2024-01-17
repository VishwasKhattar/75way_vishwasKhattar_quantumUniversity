// Controller handling the resume exam functionality

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

const resumeExam = async (req: Request, res: Response) => {
    try {
        // Getting the id of the current login user
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decodedToken = jwtDecode<MyToken>(token);
        const email = decodedToken.userId;

        const checkUser: IUser | null = await User.findOne({ email });
        const userId: string = checkUser?._id!;

        // Find the exam state for the current user
        const exam = await Exam.findOne({
            'userAnswers.userId': userId,
        });

        if (!exam) {
            return res.status(404).json({ message: 'Exam state not found' });
        }

        // Find the user's answers and exam state
        const userAnswer = exam.userAnswers.find((ua) => ua.userId === userId);

        if (!userAnswer) {
            return res.status(404).json({ message: 'User answers not found' });
        }

        // Calculate the remaining time based on the elapsed time
        const currentTime = new Date().getTime();
        const elapsed = currentTime - userAnswer.startTime!;
        const remainingTime = Math.max(userAnswer.expirationTime! - elapsed, 0);

        // Returning the exam state and remaining time
        res.status(200).json({
            examId: exam._id,
            remainingTime,
        });
    } catch (error) {
        console.error('Error resuming exam:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default resumeExam;
