//Middleware to check whether the user is login or not
//Exam can be viewed both by examiner and student so rbac is not required

import { Request , Response} from "express";


const authPage = (req : Request , res : Response , next: ()=>void) => {
    const checkLogin = req.cookies;
    if(!checkLogin){
        res.status(401).json({error:"Unauthorized Login First"});
    }
    else{
        next();
    }

}

export default authPage;