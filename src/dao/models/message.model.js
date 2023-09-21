import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  user:String,
  message:String,
  timestamp: Date
});

export const messageModel = mongoose.model("messages", messageSchema);