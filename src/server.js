require("dotenv").config();
const appInsights = require("applicationinsights");

const appInsightsConnectionString = process.env.APPINSIGHTS_CONNECTION_STRING;

if (appInsightsConnectionString) {
  try {
    appInsights
      .setup(appInsightsConnectionString)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true)
      .setAutoCollectExceptions(true)
      .setAutoCollectConsole(true, true)
      .setSendLiveMetrics(true)
      .start();
  } catch (error) {
    console.error("Application Insights init failed:", error.message);
  }
} else {
  console.log(
    "Application Insights disabled: missing APPINSIGHTS_CONNECTION_STRING"
  );
}
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

const normalizeOrigin = (value) =>
  typeof value === "string" ? value.trim().replace(/\/$/, "") : "";

const isLocalhostOrigin = (origin) =>
  /^http:\/\/localhost:\d+$/i.test(normalizeOrigin(origin));

const frontendOrigin = normalizeOrigin(process.env.FRONTEND_URL);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  const isFrontendOrigin =
    frontendOrigin && normalizedOrigin === frontendOrigin;
  const isDevLocalhost =
    process.env.NODE_ENV !== "production" && isLocalhostOrigin(normalizedOrigin);

  return isFrontendOrigin || isDevLocalhost;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 204,
};

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Socket CORS policy: origin ${origin} not allowed`));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight for all routes
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
    const userIdKey = String(userId);
    onlineUsers.set(userIdKey, socket.id);
    console.log(`User ${userIdKey} joined with socket ${socket.id}`);
    console.log("Online users:", Array.from(onlineUsers.keys()));

    // Broadcast online status
    io.emit("user_online", { userId: userIdKey });
  });

  // Handle send message
  socket.on("send_message", (data) => {
    const { receiver_id, message } = data;
    const receiverIdKey = String(receiver_id);
    const receiverSocketId = onlineUsers.get(receiverIdKey);

    console.log("send_message event:", {
      receiver_id: receiverIdKey,
      message_id: message.id,
    });
    console.log("Receiver socket ID:", receiverSocketId);
    console.log("Online users map:", Array.from(onlineUsers.entries()));

    if (receiverSocketId) {
      console.log(`Emitting receive_message to socket ${receiverSocketId}`);
      io.to(receiverSocketId).emit("receive_message", message);
    } else {
      console.log(
        `Receiver ${receiverIdKey} is not online or not found in map`
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
    
    Connection string: ${process.env.APPINSIGHTS_CONNECTION_STRING}
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
