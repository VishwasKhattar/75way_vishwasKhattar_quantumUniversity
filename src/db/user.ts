//Defining the User Model


import mongoose ,  {Document} from "mongoose";

export interface IUser extends Document {
    username : string,
    email : string,
    password : string,
    designation:string
}

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    designation:{
        type:String,
        required:true
    }
});

export default mongoose.model<IUser>('User' , userSchema);

