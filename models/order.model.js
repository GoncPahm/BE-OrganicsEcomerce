import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: {
                    type: Number,
                },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        payment: {
            type: String,
            required: true,
            enum: ["cash", "paypal"],
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
