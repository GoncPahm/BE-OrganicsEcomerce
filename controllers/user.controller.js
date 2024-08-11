import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";
import Profile from "../models/profile.model.js";
import Order from "../models/order.model.js";
export async function updateUserProfile(req, res, next) {
    if (req.user.id !== req.params.id) return next(errorHandler(403, "You can only update your own account!!!"));
    try {
        const profile = await Profile.findOneAndUpdate({ user: req.user.id }, req.body, { new: true });
        res.status(200).json(profile);
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
}

export async function getOrderHistory(req, res, next) {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const profileID = profile._id;
        const orders = await Order.find({ profile: profileID }).populate({
            path: "items.product",
            model: "Product",
        });
        res.status(200).json(orders);
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
}

export const getProfile = async (req, res, next) => {
    try {
        let existingProfile = await Profile.findOne({ user: req.user.id });
        if (!existingProfile) {
            existingProfile = new Profile({ firstname: "", lastname: "", address: "", phone: "", user: req.user.id });
            await existingProfile.save();
        }
        res.status(200).json(existingProfile);
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};
