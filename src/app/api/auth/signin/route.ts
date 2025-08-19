import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and Password are required for login" },
				{ status: 400 }
			);
		}

		await connectDB();

		const user = await User.findOne({ email });

		if (!user) {
			return NextResponse.json(
				{ error: "User doesn't exist" },
				{ status: 404 }
			);
		}

		const isVailidPassword = await bcrypt.compare(password, user.password);

		if (!isVailidPassword) {
			return NextResponse.json(
				{ error: "Invalid Credentials" },
				{ status: 401 }
			);
		}

		const token = jwt.sign(
			{ id: user._id, email: user.email },
			JWT_SECRET,
			{ expiresIn: "1hr" }
		);

		return NextResponse.json({ message: "Signin Success", token });
	} catch (error) {
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		);
	}
}
