import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import uploadOnCloudinary  from "../config/cloudinary.js";


export const sendMessage = async (req, res) => {
    try {
      const sender = req.userId;
      const receiver = req.params.receiver;
      let { message } = req.body;
      let image;
  
      if (req.file) {
        image = await uploadOnCloudinary(req.file.path);
      }
  
      let conversation = await Conversation.findOne({
        participants: { $all: [sender, receiver] },
      });
  
      const newMessage = await Message.create({
        sender,
        receiver,
        message,
        image,
      });
  
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [sender, receiver],
          messages: [newMessage._id],
        });
      } else {
        conversation.messages.push(newMessage._id);
        await conversation.save();
      }
  
      return res.status(201).json(newMessage);
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Send Message Error" });
    }
  };
  

export const getMessages = async(req, res)=>{
    try {

        const sender = req.userId;
        const {receiver} = req.params;

        let conversation = await Conversation.findOne({
            participants:{$all:[sender,receiver]}
        }).populate("messages");

        if(!conversation){
            return res.status(400).json({message:"Conversation does not exist"});
        }else{
            return res.status(200).json(conversation?.messages);
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Get Messages Error"});
    }
}