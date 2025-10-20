import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  _id: ObjectId,
  course: { type: ObjectId, ref: 'Course' },
  title: String,
  content: String, 
  type: ["video", "pdf", "text"],
  duration: Number, 
  order: Number
})

const LessonModel = mongoose.model("lessons",LessonSchema)

export {LessonModel}