require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const { testConnection } = require("../config/db");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Make io accessible to routes
app.set("io", io);

// Socket.IO connection handling
const onlineUsers = new Map(); // userId -> socketId

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins with their ID
  socket.on("join", (userId) => {
    const userIdNum = Number(userId);
    onlineUsers.set(userIdNum, socket.id);
    console.log(`User ${userIdNum} joined with socket ${socket.id}`);
    console.log("Online users:", Array.from(onlineUsers.keys()));

    // Broadcast online status
    io.emit("user_online", { userId: userIdNum });
  });

  // Handle send message
  socket.on("send_message", (data) => {
    const { receiver_id, message } = data;
    const receiverIdNum = Number(receiver_id);
    const receiverSocketId = onlineUsers.get(receiverIdNum);

    console.log("send_message event:", {
      receiver_id: receiverIdNum,
      message_id: message.id,
    });
    console.log("Receiver socket ID:", receiverSocketId);
    console.log("Online users map:", Array.from(onlineUsers.entries()));

    if (receiverSocketId) {
      console.log(`Emitting receive_message to socket ${receiverSocketId}`);
      io.to(receiverSocketId).emit("receive_message", message);
    } else {
      console.log(
        `Receiver ${receiverIdNum} is not online or not found in map`
      );
    }
  });

  // Handle friend request
  socket.on("send_friend_request", (data) => {
    const { receiver_id, request } = data;
    const receiverSocketId = onlineUsers.get(receiver_id);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_friend_request", request);
    }
  });

  // Handle friend request accepted
  socket.on("friend_request_accepted", (data) => {
    const { user_id, friendship } = data;
    const userSocketId = onlineUsers.get(user_id);

    if (userSocketId) {
      io.to(userSocketId).emit("friend_request_accepted", friendship);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Find and remove user from online users
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit("user_offline", { userId });
        break;
      }
    }
  });
});

// API Routes
app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Start listening
    server.listen(PORT, () => {
      console.log(`
🚀 Server is running on port ${PORT}
📝 Environment: ${process.env.NODE_ENV || "development"}
📚 API Documentation: http://localhost:${PORT}/api-docs
🔑 Authorize with JWT token in Swagger UI
🔗 API URL: http://localhost:${PORT}/api
🏥 Health check: http://localhost:${PORT}/api/health
🔌 Socket.IO: Running
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, io };
