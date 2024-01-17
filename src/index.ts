import express, { Application, Router } from "express";
import authRoute from "../src/routes/authRoute";
import examRoute from "../src/routes/examRoute";
import resultRoute from "../src/routes/resultRoute";
import dotenv from 'dotenv';
import bodyParser  from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

dotenv.config();
const app : Application = express();

const mongoUrl = process.env.MONGO_URL;
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(express.Router());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}))

mongoose.Promise=Promise;
mongoose.connect(`${mongoUrl}`).then(()=>{
    console.log("Database connected succesfuly");
}).catch((e)=>{
    console.log(e);
})

app.use("/api" , authRoute);
app.use('/api' , examRoute);
app.use('/api' , resultRoute);

app.listen(PORT , () => {
    console.log(`Server Connected Successfuly on ${PORT}`);
})