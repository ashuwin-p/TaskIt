"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

interface DecodedToken {
	id: string;
	email: string;
	iat: number;
	exp: number;
}

export default function Dashboard() {
	const router = useRouter();
	const [user, setUser] = useState<DecodedToken | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("auth/signin");
			return;
		}
		try {
			const decoded = jwt.decode(token) as DecodedToken;

			if (!decoded || decoded.exp * 1000 < Date.now()) {
				localStorage.removeItem("token");
				router.push("auth/signin");
			} else {
				setUser(decoded);
			}
		} catch (error) {
			localStorage.removeItem("token");
			router.push("auth/signin");
		} finally {
			setLoading(false);
		}
	}, [router]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
				Checking authentication...
			</div>
		);
	}
	if (!user) return null;
	return (
		<div className="h-screen bg-gray-300">
			<nav className="flex flex-row items-center justify-between bg-gray-600 px-6 py-3 shadow-md">
				<div>
					<h2 className="text-2xl">Task It</h2>
				</div>
				<div>
					<span className="mr-3">Hi, {user.email} </span>
					<button
						className="bg-red-700 hover:bg-red-800 p-2 rounded-lg cursor-pointer"
						onClick={() => {
							localStorage.removeItem("token");
							router.push("/auth/signin");
						}}
					>
						Sign out
					</button>
				</div>
			</nav>
		</div>
	);
}
