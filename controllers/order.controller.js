import { application } from "express";
import Cart from "../models/cart.model.js";
import CartItem from "../models/cartItem.model.js";
import Order from "../models/order.model.js";
import Profile from "../models/profile.model.js";
import { errorHandler } from "../utils/error.js";

const clientId = "AaH-Ma_yIEXI_ptG8LVPc4qAIven4Ve-Jd4aZq-UTT-GJfSbWVT9SrWiMcN5Ofo_3ZJQWWxmz6fwUEZn";
const clientSecret = "EPdwKx5Asz1y1RpBmGltBAVgT9OlbxLrejOL8INTmDlTCA89WliqX1oDy1qqS-knY9PRWAXXsIqtPvX8";

const generateAccessToken = async () => {
    try {
        const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
            }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching access token: ${response.statusText}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

const createOrder = async (data) => {
    const access_token = await generateAccessToken();
    try {
        const response = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        items: data.items.map((item) => {
                            const product = item.product;
                            return {
                                name: product.name,
                                unit_amount: {
                                    currency_code: "USD",
                                    value: product.discountPrice > 0 ? product.discountPrice : product.price,
                                },
                                quantity: item.quantity,
                            };
                        }),
                        amount: {
                            currency_code: "USD",
                            value: data.totalPrice + 30,
                            breakdown: {
                                item_total: {
                                    currency_code: "USD",
                                    value: data.totalPrice,
                                },
                                shipping: {
                                    currency_code: "USD",
                                    value: 30,
                                },
                            },
                        },
                    },
                ],
                application_context: {
                    return_url: "http://localhost:3000/",
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Error creating PayPal order: ${response.statusText}`);
        }

        const result = await response.json();
        return result.id;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

const captureOrder = async (orderId) => {
    const access_token = await generateAccessToken();
    try {
        const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("PayPal Error Details:", errorData);
            throw new Error(`Error capturing PayPal order: ${response.statusText}`);
        }

        const result = await response.json();
        // console.log("Order captured:", result);
        return result;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export const purchaseOrderByPaypal = async (req, res, next) => {
    const { profile, items, totalPrice, payment, isPaid } = req.body;
    try {
        const updateProfile = await Profile.findOneAndUpdate({ user: req.user.id }, profile, { new: true });
        await updateProfile.save();
        const newOrder = new Order({
            profile: updateProfile._id,
            items: items.map((item) => ({ product: item.product._id, quantity: item.quantity })),
            totalPrice: totalPrice,
            payment: payment,
            isPaid: isPaid,
        });
        await newOrder.save();

        const orderData = {
            items: items,
            totalPrice: totalPrice,
        };

        const orderId = await createOrder(orderData);
        // console.log("id", orderId);

        const cart = await Cart.findOne({ user: req.user.id });
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        await CartItem.deleteMany({ cart: cart._id });

        res.status(200).json({
            idPaypal: orderId,
            idData: newOrder._id,
        });
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};

export const captureOrderPaypal = async (req, res, next) => {
    try {
        const result = await captureOrder(req.body.orderId);
        const order = await Order.findById(req.body.idData);
        if (!order) {
            return next(errorHandler(404, "Order not found"));
        }
        order.isPaid = true;
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};

export const purchaseNewOrder = async (req, res, next) => {
    const { profile, items, totalPrice, payment, isPaid } = req.body;
    console.log(profile);
    try {
        const updateProfile = await Profile.findOneAndUpdate({ user: req.user.id }, profile, { new: true });
        await updateProfile.save();
        const newOrder = new Order({
            profile: updateProfile._id,
            items: items.map((item) => ({ product: item.product._id, quantity: item.quantity })),
            totalPrice: totalPrice,
            payment: payment,
            isPaid: isPaid,
        });
        await newOrder.save();
        const cart = await Cart.findOne({ user: req.user.id });
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        await CartItem.deleteMany({ cart: cart._id });

        res.status(200).json(newOrder._id);
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};
