import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CartItem",
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
