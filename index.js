import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import setupSockets from "./sockets/index.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
import connect from "./config/index.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // Địa chỉ frontend của bạn
        methods: ["GET", "POST"],
        credentials: true,
    },
});

connect();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.use((error, req, res, next) => {
    return res.status(error.statusCode).json({
        success: error.success,
        message: error.message || "Internal Server Error",
    });
});

setupSockets(io);

httpServer.listen(3001, () => {
    console.log("Server is running on port 3001");
});
