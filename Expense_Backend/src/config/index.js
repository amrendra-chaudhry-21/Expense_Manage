import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../common/utils/logger.js";
import { DB_STORE_NAME } from "../common/constant.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envInfo = process.env.NODE_ENV || "development";
const envFile = envInfo === "production" ? ".env.production" : ".env.staging";

dotenv.config({ path: join(__dirname, "../../", envFile) });

if (process.env.NODE_ENV) {
  dotenv.config({
    path: join(__dirname, "../../", `.env.${process.env.NODE_ENV}`),
  });
} else {
  dotenv.config({ path: join(__dirname, "../../.env") });
}
const isDev = process.env.NODE_ENV !== "production";
const isReadPrimary = process.env.READ_PREFERENCE === "primary";
const connectionOptions = {
  maxPoolSize: parseInt(process.env.MAX_POOL_SIZE, 10) || 350,
  minPoolSize: parseInt(process.env.MIN_POOL_SIZE, 10) || 150,
  serverSelectionTimeoutMS:
    parseInt(process.env.SERVER_SELECTION_TIMEOUT_MS, 10) || 5000, // Reduced from 30000
  socketTimeoutMS: parseInt(process.env.SOCKET_TIMEOUT_MS, 10) || 45000,
  connectTimeoutMS: parseInt(process.env.CONNECT_TIMEOUT_MS, 10) || 10000,
  waitQueueTimeoutMS: parseInt(process.env.WAIT_QUEUE_TIMEOUT_MS, 10) || 5000,
  heartbeatFrequencyMS:
    parseInt(process.env.HEARTBEAT_FREQUENCY_MS, 10) || 1000, // Increased frequency for faster detection
  maxIdleTimeMS: parseInt(process.env.MAX_IDLE_TIME_MS, 10) || 10000, // Reduced idle time
  maxStalenessSeconds: parseInt(process.env.MAX_STALENESS_SECONDS, 10) || 90,
  compressors: [process.env.COMPRESSION || "zlib"],
  zlibCompressionLevel: parseInt(process.env.ZLIB_COMPRESSION_LEVEL, 10) || 6,
  readPreference: process.env.READ_PREFERENCE || "primary",
  retryReads: process.env.RETRY_READS === "true",
  retryWrites: process.env.RETRY_WRITES === "true",
  writeConcern: {
    w: process.env.WRITE_CONCERN || "majority",
    journal: process.env.JOURNAL_COMMITTED === "true",
    timeout: 5000,
  },
  readConcern: { level: "majority" },
  ...(isDev && isReadPrimary ? { autoIndex: true, autoCreate: true } : {}),
};

let listenersAttached = false;

const attachMongoListeners = () => {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on("connected", () => {
    isConnected = true;
    logger.success("🍃 MongoDB Cluster Connected & Synchronized");
  });

  mongoose.connection.on("error", (err) => {
    logger.error("❌ MongoDB connection error:", err.message);
    isConnected = false;
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("⚠️ MongoDB disconnected");
    isConnected = false;
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("🔄 MongoDB reconnected");
    isConnected = true;
  });
};

let isConnected = false;
let connectionPromise = null;

const connectDB = async (retries = 5, initialDelay = 1000) => {
  if (isConnected) {
    logger.info("📊 Already connected to MongoDB");
    return mongoose.connection;
  }
  if (connectionPromise) {
    logger.info("📊 MongoDB connection in progress, waiting...");
    return connectionPromise;
  }
  connectionPromise = _connectDB(retries, initialDelay);
  return connectionPromise;
};

const _connectDB = async (retries, delay) => {
  try {
    if (!process.env.MONGOOSE_URI) {
      throw new Error("❌ MONGOOSE_URI is not defined");
    }

    attachMongoListeners(); // ✅ only once

    await mongoose.connect(
      `${process.env.MONGOOSE_URI}/${DB_STORE_NAME}`,
      connectionOptions
    );

    if (process.env.NODE_ENV === "development") {
      mongoose.set("debug", true);
    }

    return mongoose.connection;
  } catch (error) {
    if (retries === 0) {
      logger.error("❌ MongoDB connection failed after maximum retries");
      connectionPromise = null;
      throw error;
    }

    logger.warn(
      `⚠️ MongoDB connection failed. Retrying in ${delay}ms... (${retries} attempts left)`
    );

    await new Promise((resolve) => setTimeout(resolve, delay));

    // Exponential backoff with jitter
    const nextDelay = Math.min(delay * 2, 30000) + Math.random() * 500;

    return _connectDB(retries - 1, nextDelay);
  }
};

const closeDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      isConnected = false;
      connectionPromise = null;
      logger.info("🔌 MongoDB connection closed cleanly");
    }
  } catch (error) {
    logger.error("❌ Failed to close MongoDB connection", {
      error: error.message,
    });
    throw error;
  }
};
const checkDBHealth = async () => {
  const start = Date.now();
  try {
    await mongoose.connection.db.admin().ping();
    const end = Date.now();
    return {
      status: "healthy",
      pingMs: end - start,
      timestamp: new Date(),
    };
  } catch (error) {
    const end = Date.now();
    return {
      status: "unhealthy",
      pingMs: end - start,
      error: error.message,
      timestamp: new Date(),
    };
  }
};

export { connectDB, closeDB, checkDBHealth };
