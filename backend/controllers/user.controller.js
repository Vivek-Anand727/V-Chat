import User from "../models/user.model.js";
import  uploadOnCloudinary  from "../config/cloudinary.js"


export const getCurrentUser = async (req, res) => {
    try {
        const userId =  req.userId;
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({message:"Current User Error"});
    }
}

export const editProfile = async(req, res) => {
    try {
        const {name} = req.body;
        let image;
        if(req.file){
            image = await uploadOnCloudinary(req.file.path);
        }
        const user = await User.findByIdAndUpdate(req.userId,{
            name,
            image
        },{
            new:true
        }).select("-password");

        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }else{
            return res.status(200).json(user);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Edit Profile Error"});
    }
}

export const getOtherUsers = async(req, res) => {
    try {
        let users = await User.find({
            _id:{$ne:req.userId}
        }).select("-password");
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Get Other Users Error"});
    }
}