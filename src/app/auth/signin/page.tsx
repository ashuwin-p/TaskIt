"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginFormSData = {
	email: string;
	password: string;
};

export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [serverError, setServerError] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormSData>();

	const onSubmit = async (data: LoginFormSData) => {
		setLoading(true);
		setServerError("");
		try {
			const res = await fetch("/api/auth/signin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const result = await res.json();

			if (!res.ok) {
				setServerError(result.error);
			} else {
				localStorage.setItem("token", result.token);
				router.push("/dashboard");
			}
		} catch (error) {
			setServerError("Something went wrong. Try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-blue-200 flex justify-center items-center h-screen">
			<div className="bg-blue-300 w-xl p-2 rounded-lg">
				<div className="flex flex-col items-center justify-center">
					<h1 className="text-white text-3xl font-bold  mb-3">
						Signin
					</h1>
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div>
						<input
							type="email"
							placeholder="email"
							{...register("email", {
								required: "email is required",
							})}
							className="w-full bg-white text-gray-900 rounded-lg p-2.5 mb-1.5"
						/>
						{errors.email && (
							<p className="text-red-700 text-sm m-1">
								{errors.email.message}
							</p>
						)}
					</div>
					<div>
						<input
							type="password"
							placeholder="password"
							{...register("password", {
								required: "password is required",
							})}
							className="w-full bg-white text-gray-900 rounded-lg p-2.5 mb-1.5"
						/>
						{errors.password && (
							<p className="text-red-700 text-sm m-1">
								{errors.password.message}
							</p>
						)}
					</div>
					<div className="flex flex-col justify-center items-center">
						<button
							type="submit"
							className="bg-blue-600 rounded-lg text-white p-2 m-2 cursor-pointer"
						>
							{loading ? "Signing in..." : "Sign in"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
