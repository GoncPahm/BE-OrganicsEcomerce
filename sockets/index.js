export default function setupSockets(io) {
    io.on("connection", (socket) => {
        socket.on("join-room", ({ productId }) => {
            console.log("join");
            socket.join(productId);
        });
        socket.on("post-review", ({ productId, reviews }) => {
            io.to(productId).emit("receive-review", reviews);
        });
        socket.on("leave-room", ({ productId }) => {
            console.log("leave");
            socket.leave(productId);
        });
    });
}
