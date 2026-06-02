// const Redis = require('ioredis');

// const  redisClient = new Redis({
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//     password: process.env.REDIS_PASSWORD
// });

// redisClient.on("connect",()=>{
//     console.log("Redis connected");
// });

// redisClient.safeGet = async(key) => {
//     try {
//         return await redisClient.get(key);
//     } catch (error) {
//         console.error("Redis Get Error", error);
//         return null
//     }
// }

// module.exports = redisClient;

const Redis = require("ioredis");

const redisOptions = {};
if (process.env.REDIS_URL) {
  redisOptions.url = process.env.REDIS_URL;
} else {
  if (process.env.REDIS_HOST) {
    redisOptions.host = process.env.REDIS_HOST;
  }
  if (process.env.REDIS_PORT) {
    redisOptions.port = Number(process.env.REDIS_PORT);
  }
  if (process.env.REDIS_PASSWORD) {
    redisOptions.password = process.env.REDIS_PASSWORD;
  }
}

if (
  process.env.REDIS_TLS === "true" ||
  (process.env.REDIS_URL && process.env.REDIS_URL.startsWith("rediss://"))
) {
  redisOptions.tls = {};
}

const redisClient = new Redis({
  ...redisOptions,
  connectTimeout: 10000,
  maxRetriesPerRequest: 3,
});

redisClient.on("connect", () => {
  console.log("✅ Redis Connected");
});

redisClient.on("error", (err) => {
  console.log("❌ Redis Error:", err.message);
});

redisClient.safeGet = async (key) => {
  if (!key) return null;
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error("Redis safeGet error:", error.message);
    return null;
  }
};

redisClient.safeSet = async (key, value, ttlSeconds = 0) => {
  if (!key) return false;
  try {
    const payload = typeof value === "string" ? value : JSON.stringify(value);
    if (ttlSeconds > 0) {
      await redisClient.set(key, payload, "EX", ttlSeconds);
    } else {
      await redisClient.set(key, payload);
    }
    return true;
  } catch (error) {
    console.error("Redis safeSet error:", error.message);
    return false;
  }
};

redisClient.safeGetJson = async (key) => {
  const value = await redisClient.safeGet(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Redis safeGetJson error:", error.message);
    return null;
  }
};

redisClient.safeSetJson = async (key, value, ttlSeconds = 0) => {
  return await redisClient.safeSet(key, value, ttlSeconds);
};

redisClient.safeDel = async (key) => {
  if (!key) return 0;
  try {
    return await redisClient.del(key);
  } catch (error) {
    console.error("Redis safeDel error:", error.message);
    return 0;
  }
};

redisClient.safeDelPattern = async (pattern) => {
  if (!pattern) return 0;
  try {
    const keys = await redisClient.keys(pattern);
    if (!keys || keys.length === 0) return 0;
    return await redisClient.del(...keys);
  } catch (error) {
    console.error("Redis safeDelPattern error:", error.message);
    return 0;
  }
};

module.exports = redisClient;
