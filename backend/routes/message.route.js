import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import isAuth from "../middlewares/isAuth.js";
import {upload} from "../middlewares/multer.js";

const messageRouter = express.Router();


messageRouter.post("/send/:receiver",isAuth,upload.single("image"),sendMessage);
messageRouter.get("/get/:receiver",isAuth,getMessages);

export default messageRouter;


