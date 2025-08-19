import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
	try {
		const { username, email, password } = await req.json();

		if (!username || !email || !password) {
			return NextResponse.json(
				{ message: "All Fields are required for Signup" },
				{ status: 400 }
			);
		}

		await connectDB();

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return NextResponse.json(
				{ error: "User with email already exists" },
				{ status: 400 }
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			username,
			email,
			password: hashedPassword,
		});

		await newUser.save();
		return NextResponse.json(
			{ message: "User Created Successfully" },
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Something went Wrong" },
			{ status: 500 }
		);
	}
}
