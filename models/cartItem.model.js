import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
        },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const CartItem = mongoose.model("CartItem", cartItemSchema);
export default CartItem;
