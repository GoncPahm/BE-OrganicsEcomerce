import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["vegetable", "fruit", "juice", "other"],
        },
        price: {
            type: Number,
            required: true,
        },
        discountPrice: {
            type: Number,
            default: 0,
        },
        weight: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            required: true,
            enum: ["kg", "g", "lb", "oz", "ml"],
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
        },
        imageUrls: {
            type: [String],
            required: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviews: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                comment: { type: String, required: true },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
