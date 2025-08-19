import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
	try {
		await connectDB();
		return NextResponse.json({ message: "MongoDB Connected Successfully" });
	} catch {
		return NextResponse.json(
			{ message: "MongoDB Connection failed" },
			{ status: 500 }
		);
	}
}
