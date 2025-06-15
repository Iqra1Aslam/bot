// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import mongoose from "mongoose";
// import http from "http";
// import "dotenv/config";

// import routes from "../routes/index.js";

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// app.use("/api", routes);

// const port = process.env.PORT || 5000;
// const server = http.createServer(app);

// // mongoose.set("strictQuery", false);
// mongoose.connect(process.env.MONGODB_URL).then(() => {
//   console.log("Mongodb connected");
//   server.listen(port, () => console.log(`Server is listening on port ${port}`));
// }).catch((err) => {
//   console.log({ err });
//   process.exit(1);
// });

// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import mongoose from "mongoose";
// import routes from "../routes/index.js";

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use("/api", routes);

// // --- MongoDB connection caching for serverless ---
// let cached = global.mongoose || { conn: null, promise: null };

// async function connectDB() {
//   if (cached.conn) return cached.conn;
//   if (!cached.promise) {
//     cached.promise = mongoose.connect(process.env.MONGODB_URL).then((mongoose) => {
//       console.log("MongoDB connected");
//       return mongoose;
//     });
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default async function handler(req, res) {
//   await connectDB();
//   app(req, res);
// }

// // Make sure cache is available across hot-reloads
// if (!global.mongoose) {
//   global.mongoose = cached;
// }4

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import routes from "../routes/index.js";
import "dotenv/config";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api", routes);

// --- MongoDB connection caching for serverless ---
let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URL).then((mongoose) => {
      console.log("MongoDB connected");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// LOCAL TESTING: Start server if not in production (not on Vercel)
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  });
}

// For Vercel serverless
export default async function handler(req, res) {
  await connectDB();
  app(req, res);
}

// Mongo cache for hot reloads/serverless
if (!global.mongoose) {
  global.mongoose = cached;
}