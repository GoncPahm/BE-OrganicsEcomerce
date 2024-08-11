import User from "../models/user.model.js";
import Cart from "../models/cart.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import CartItem from "../models/cartItem.model.js";
import Profile from "../models/profile.model.js";
export async function sign_up(req, res, next) {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email, password: password });
        await newUser.save();
        const newCart = new Cart({ user: newUser._id, items: [], totalPrice: 0 });
        await newCart.save();
        res.status(201).json({
            success: true,
            messsage: "Sign up successfully!!!",
        });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const message = `${field} already exists`;
            return next(errorHandler(500, message));
        }
        return next(errorHandler(500, "Please write full information!!!"));
    }
}
export async function sign_in(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) return next(errorHandler(500, "Please write full information!!!"));
    try {
        const user = await User.findOne({ email: email });
        if (!user) return next(errorHandler(500, "User not found!!!"));
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return next(errorHandler(500, "Password is wrong!!!"));
        const { password: pass, ...rest } = user._doc;
        const cart = await Cart.findOne({ user: user._id });
        const cartItems = await CartItem.find({ cart: cart._id }).populate("product");
        const listProduct = cartItems.map((cartItem) => {
            return {
                id: cartItem._id,
                product: cartItem.product,
                quantity: cartItem.quantity,
            };
        });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie("access_token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
            .status(200)
            .json({
                user: rest,
                cartItems: listProduct,
                totalPrice: cart.totalPrice,
            });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

export async function google(req, res, next) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const cart = await Cart.findOne({ user: user._id });
            const cartItems = await CartItem.find({ cart: cart._id }).populate("product");
            const listProduct = cartItems.map((cartItem) => {
                return {
                    id: cartItem._id,
                    product: cartItem.product,
                    quantity: cartItem.quantity,
                };
            });
            const { password: pass, ...rest } = user._doc;
            res.cookie("access_token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            })
                .status(200)
                .json({
                    user: rest,
                    cartItems: listProduct,
                    totalPrice: cart.totalPrice,
                });
        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const username = req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
            const newUser = new User({ username, email: req.body.email, password: generatePassword });
            await newUser.save();
            const newCart = new Cart({ user: newUser._id, items: [], totalPrice: 0 });
            await newCart.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res.cookie("access_token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            })
                .status(200)
                .json({
                    user: rest,
                    cartItems: [],
                    totalPrice: 0,
                });
        }
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

export async function sign_out(req, res, next) {
    try {
        res.clearCookie("access_token");
        res.status(200).json({ message: "Sign out successfully!!!" });
    } catch (error) {
        next(errorHandler(400, error.message));
    }
}
