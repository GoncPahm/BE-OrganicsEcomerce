import Cart from "../models/cart.model.js";
import CartItem from "../models/cartItem.model.js";
import { errorHandler } from "../utils/error.js";
export const addProductToCart = async (req, res, next) => {
    const idUser = req.user.id;
    const cart = await Cart.findOne({ user: idUser }).populate("items");

    try {
        const isCreatedItem = await CartItem.findOne({ product: req.body.product, cart: cart._id });
        if (isCreatedItem) {
            console.log(cart._id);
            console.log(isCreatedItem);
            return next(errorHandler(404, "Item is added!"));
        } else {
            const newCartItems = new CartItem({ ...req.body, cart: cart._id });
            await newCartItems.save();
            cart.items.push(newCartItems);
            cart.totalPrice += newCartItems.price * newCartItems.quantity;
            await cart.save();
            const product = (await newCartItems.populate("product")).product;
            res.status(200).json({
                id: newCartItems._id,
                product: product,
                quantity: newCartItems.quantity,
            });
        }
    } catch (error) {
        return next(errorHandler(404, error.message));
    }
};

export const deleteCartItem = async (req, res, next) => {
    const idCartItemDeleted = req.params.id_item;
    try {
        const deletedCartItem = await CartItem.findById(idCartItemDeleted);
        if (!deletedCartItem) {
            return next(errorHandler(404, "Not found item"));
        }
        const id = deletedCartItem._id;
        const product = (await deletedCartItem.populate("product")).product;
        const quantity = deletedCartItem.quantity;
        const cart = await Cart.findOne({ user: req.user.id }).populate("items");
        cart.items = cart.items.filter((item) => item._id.toString() !== idCartItemDeleted.toString());
        cart.totalPrice -= deletedCartItem.price * deletedCartItem.quantity;
        await cart.save();
        await deletedCartItem.deleteOne({ _id: idCartItemDeleted });
        res.status(200).json({
            id: id,
            product: product,
            quantity: quantity,
        });
    } catch (error) {
        return next(errorHandler(404, error.message));
    }
};

export const updateCartItem = async (req, res, next) => {
    try {
        const updateItem = await CartItem.findByIdAndUpdate(req.body.id, req.body, { new: true });
        const cart = await Cart.findOne({ user: req.user.id }).populate("items");
        cart.totalPrice = cart.items.reduce((acc, item) => {
            return (acc += item.quantity * item.price);
        }, 0);
        await cart.save();
        res.status(200).json(updateItem);
    } catch (error) {
        return next(500, error.message);
    }
};
