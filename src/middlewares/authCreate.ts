//Middleware that basically checks for the examiner role access

import { Request, Response } from "express";
import User, { IUser } from "../db/user";
import {jwtDecode} from "jwt-decode";

interface MyToken {
    userId: string;
    iat: number;
    exp: number;
    token: string; 
}

const roles = ["Examiner"];

const authCreate = async (req: Request, res: Response, next: () => void) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    //Checking the role by firstly revieving the token and then 
    //decoding it to verify the role based on email id signed in jwt.
    
    const decodedToken = jwtDecode<MyToken>(token);
    const email = decodedToken.userId;

    const checkUser: IUser | null = await User.findOne({ email });
    const designation: string = checkUser?.designation!;

    if (!roles.includes(designation)) {
        return res.status(403).json({ error: "You do not have the permission to visit this page" });
    }

    next();
}

export default authCreate;
