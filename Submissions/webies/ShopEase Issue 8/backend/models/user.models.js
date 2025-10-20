import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    
    name: {
      type : String,
      required:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: false,
        select: false
    },
    roles :{
        type:  String,
        enum:["ADMIN","USER"],
        default:"USER",
    }
   
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 7);
    next();
});

export default mongoose.model("User", userSchema);