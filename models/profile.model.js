import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
        },
        lastname: {
            type: String,
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
