import Product from "../models/product.model.js";
import { errorHandler } from "../utils/error.js";

export const getAllProducts = async (req, res, next) => {
    const products = await Product.find();
    try {
        if (!products) {
            res.status(404).json({
                message: "Not found products collection in database",
            });
        }
        res.status(200).json(products);
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};

export const fillterProducts = async (req, res, next) => {
    let products = [];
    try {
        if (req.query.type) {
            if (req.query.type === "feature") {
                products = await Product.find({ isFeatured: true }).limit(6);
            }
            if (req.query.type === "lastest") {
                products = await Product.find().sort({ createAt: -1 }).limit(6);
            }
            if (req.query.type === "bestseller") {
                products = await Product.find().sort({ stock: 1 }).limit(6);
            }
            res.status(200).json(products);
        } else if (req.query.category) {
            if (req.query.category === "vegetable") {
                products = await Product.find({ category: "vegetable" }).limit(6);
            }
            res.status(200).json(products);
        } else {
            res.status(404).json({
                message: "Not found category",
            });
        }
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};

export const getDetailsProduct = async (req, res, next) => {
    const idProduct = req.params.id;

    try {
        const product = await Product.findById(idProduct);
        if (!product) return next(errorHandler(404, "Not found product"));
        res.status(200).json(product);
    } catch (error) {
        return next(errorHandler(404, error.message));
    }
};

export const postNewComment = async (req, res, next) => {
    const idProduct = req.params.id;
    try {
        const product = await Product.findById(idProduct);
        if (!product) return next(errorHandler(404, "Not found product"));
        product.reviews.push(req.body);
        await product.save();
        res.status(200).json(product);
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};

export const getProductsWithCategory = async (req, res, next) => {
    const category = req.params.category;
    const { avaiability, priceHigh, priceLow, sortQuery, page = 1 } = req.query;

    const pageNumber = parseInt(page, 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
        return res.status(400).json({ error: "Invalid page number" });
    }

    const query = { category: category };

    if (avaiability !== "") {
        if (avaiability === "in-stock") {
            query.stock = { $gt: 0 };
        } else if (avaiability === "sold-out") {
            query.stock = 0;
        }
    }

    let productsQuery = Product.find(query)
        .sort({ stock: -1 })
        .limit(3)
        .skip((pageNumber - 1) * 3);

    if (priceHigh > 0) {
        productsQuery = productsQuery.where("discountPrice").gte(priceLow).lte(priceHigh);
    }

    if (sortQuery === "alphaAtoZ") {
        productsQuery = productsQuery.sort({ name: 1 });
    } else if (sortQuery === "alphaZtoA") {
        productsQuery = productsQuery.sort({ name: -1 });
    } else if (sortQuery === "priceHightoLow") {
        productsQuery = productsQuery.sort({ discountPrice: -1 });
    } else if (sortQuery === "priceLowtoHigh") {
        productsQuery = productsQuery.sort({ discountPrice: 1 });
    }

    try {
        const [products, count] = await Promise.all([productsQuery.exec(), Product.countDocuments(query)]);
        const pages = Math.ceil(count / 3);

        res.status(200).json({
            products: products,
            pages: pages,
        });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

export const searchProducts = async (req, res, next) => {
    const { key } = req.body;
    console.log(key);
    try {
        const products = await Product.find({ name: { $regex: key, $options: "i" } });
        res.status(200).json(products);
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};
