"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Elsie_Swash_Caps } from "next/font/google";

type FormData = {
	username: string;
	email: string;
	password: string;
};

export default function signUpPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [serverError, setServerError] = useState("");
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit = async (data: FormData) => {
		setLoading(true);
		setServerError("");
		try {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const result = await res.json();

			if (!res.ok) {
				setServerError(result.error);
			} else {
				router.push("/auth/signin");
			}
		} catch (error) {
			setServerError("Something went wrong. Try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-green-100 flex justify-center items-center h-screen">
			<div className="bg-green-400 w-xl p-2 rounded-lg">
				<div className="flex flex-col items-center justify-center">
					<h1 className="text-white text-3xl font-bold  mb-3">
						Signup
					</h1>
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div>
						<input
							type="text"
							placeholder="Username"
							{...register("username", {
								required: "Username is required",
							})}
							className="w-full bg-white text-gray-900 rounded-lg p-2.5 mb-1.5"
						/>
						{errors.username && (
							<p className="text-red-700 text-sm m-1">
								{errors.username.message}
							</p>
						)}
					</div>
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
							placeholder="Password"
							{...register("password", {
								required: "Password is required",
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
							className="bg-green-800 rounded-lg text-white p-2 m-2 cursor-pointer"
						>
							{loading ? "Creating Account..." : "Create Account"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
