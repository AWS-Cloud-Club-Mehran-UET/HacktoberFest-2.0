import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
  _id: ObjectId,
  student: { type: ObjectId, ref: 'User' },
  course: { type: ObjectId, ref: 'Course' },
  progress: Number, 
  completed: Boolean,
  enrolledAt: Date
}
)

const EnrollmentModel = mongoose.model("enrollments" , EnrollmentSchema)

export {EnrollmentModel}