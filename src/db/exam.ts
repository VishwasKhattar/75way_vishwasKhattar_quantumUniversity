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
}

interface IQues {
    questionNumber: number;
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface IExam {
    questions: IQues[];
    duration: number;
    userAnswers: IUserAnswer[];
    correctAnswers:{[key:number] : string};
}

interface ExamModel extends IExam, Document {}

const examSchema = new Schema<ExamModel>({
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
        },
    ],
});

const ExamModel = model<ExamModel>('Exam' , examSchema);

export default ExamModel;
