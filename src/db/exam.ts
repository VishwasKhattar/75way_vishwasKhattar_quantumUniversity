//Schema defining all the details regarding the exam i.e
//1. Questions
//2. User Answers
//3. Result of all the students

import { Document, Schema, model } from "mongoose";

interface IUserAnswer {
    userId: string;
    answers: {
        questionNumber: number;
        selectedOption: string;
    }[];
    startTime?: number;
    expirationTime?: number;
}

interface IQues {
    questionNumber: number;
    questionText: string;
    options: string[];
    correctAnswer: string;
}

export interface IExam extends Document {
    questions: IQues[];
    duration: number;
    userAnswers: IUserAnswer[];
    correctAnswers: { [key: number]: string };
}

const examSchema = new Schema<IExam>({
    questions: [
        {
            questionNumber: {
                type: Number,
                required: true,
                unique: true
            },
            questionText: {
                type: String,
                required: true,
            },
            options: {
                type: [String],
                required: true,
            },
            correctAnswer: {
                type: String,
                required: true,
            }
        },
    ],
    duration: {
        type: Number,
        required: true,
    },
    userAnswers: [
        {
            userId: {
                type: String,
                required: true,
            },
            answers: [
                {
                    questionNumber: {
                        type: Number,
                        required: true,
                    },
                    selectedOption: {
                        type: String,
                        required: true,
                    },
                },
            ],
            startTime: {
                type: Number,
            },
            expirationTime: {
                type: Number,
            },
        },
    ],
    correctAnswers: {
        type: Schema.Types.Mixed,
        default: {},
    },
});

const ExamModel = model<IExam>('Exam', examSchema);

export default ExamModel;
