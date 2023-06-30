import mongoose, { Schema } from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDB() {
  if (cached.conn) {
    console.log("Cached mongodb is called!");
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI);
    console.log("connected to mongoDB!");
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDB;
