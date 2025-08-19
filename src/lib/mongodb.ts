import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
	throw new Error("Please Define MongoDB URI in env");
}

const MONGODB_URI: string = uri;

let cached = (global as any).mongoose;

if (!cached) {
	cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = mongoose
			.connect(MONGODB_URI)
			.then((mongoose) => mongoose);
	}
	cached.conn = await cached.promise;
	return cached.conn;
}
