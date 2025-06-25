import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";

export const signUp = async (req, res) => {

    try {
        const {userName,email,password} = req.body;
        
        if(!userName || !email || !password){
            res.status(400).send({message:"Please fill all the fields"});
            return;
        }
        
        const userByUsername = await User.findOne({userName});
        
        if(userByUsername){
            return res.status(400).json({message:"Username already exists"});
        }
                
        const userByEmail = await User.findOne({email});

        if(userByEmail){
            return res.status(400).json({message:"User already exists"});
        }

        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userName,
            email,
            password:hashedPassword
        }); 

        const token = genToken(user._id);

        res.cookie("token",token,{
            httpOnly:true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite:"None",
            secure:false
        });

        return res.status(201).json({message:"User created successfully" , user});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Signup Error"});
    }
}




export const logIn = async (req, res) => {

    try {
        const {email,password} = req.body;

        if(!email || !password){
            res.status(400).send({message:"Please fill all the fields"});
            return;
        }
        
        const userByEmail = await User.findOne({email});

        if(!userByEmail){
            return res.status(400).json({message:"User does not exist"});
        }

        const isMatch = await bcrypt.compare(password, userByEmail.password);

        if(!isMatch){
            return res.status(400).json({message:"Password is incorrect"});
        }

        const token = genToken(userByEmail._id);

        res.cookie("token",token,{
            httpOnly:true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite:"None",
            secure:false
        });

        return res.status(200).json({message:"User logged in successfully" , user : userByEmail});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Login Error"});
    }
}

export const logOut = async(req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({message:"User logged out successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Logout Error"});
    }
}