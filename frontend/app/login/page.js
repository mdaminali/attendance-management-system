"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

// Yup validation schema
const schema = yup
	.object({
		email: yup.string().email("Invalid email address").required("Email is required"),
		password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
	})
	.required()

export default function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	})

	// Form submission handler
	const onSubmit = (data) => {
		console.log(data) // Handle login logic here
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
				<h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
					{/* Email Field */}
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input type="text" id="email" placeholder="Enter your email" className={`w-full px-4 py-2 mt-1 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`} {...register("email")} />
						{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
					</div>

					{/* Password Field */}
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input type="password" id="password" placeholder="Enter your password" className={`w-full px-4 py-2 mt-1 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`} {...register("password")} />
						{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
					</div>

					{/* Submit Button */}
					<button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
						Login
					</button>
				</form>
			</div>
		</div>
	)
}
