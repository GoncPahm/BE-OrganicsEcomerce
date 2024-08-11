import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Path username is required!!!"],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Path email is required!!!"],
            unique: true,
            match: [/.+\@.+\..+/, "Email is not valid"],
        },
        password: {
            type: String,
            minlength: [3, "Password is too short"],
            required: [true, "Path password is required!!!"],
        },
        avatar: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        },
    },
    {
        timestamps: true,
    }
);
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


const User = mongoose.model("User", userSchema);

export default User;
