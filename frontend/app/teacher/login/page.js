"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "axios"
import { toast } from "react-toastify"

import { redirect, usePathname, useSearchParams } from "next/navigation"

// Yup validation schema
const schema = yup
	.object({
		email: yup.string().email("Invalid email address").required("Email is required"),
		password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
	})
	.required()

export default function Login() {
	const [loginSuccess, setLoginSuccess] = useState(false)
	const [teacherInfo, setTeacherInfo] = useState(null)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	})

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedTeacherInfo = localStorage.getItem("teacherInfo")
			if (storedTeacherInfo) {
				let jsonData = JSON.parse(storedTeacherInfo)
				if (jsonData?.type === "teacher") {
					setLoginSuccess(true)
				}
			}
		}
	}, [])

	useEffect(() => {
		console.log("loginSuccess", loginSuccess)
		if (!loginSuccess) return
		redirect("/teacher/dashboard")
	}, [loginSuccess])

	const onSubmit = async (data) => {
		console.log("Form data:", data)

		try {
			const res = await axios.post("http://localhost:3001/api/teacherLogin", data)

			if (res.data?.message === "Login successful!") {
				toast.success("Login successful!")
				localStorage.setItem("teacherInfo", JSON.stringify(res.data))
				setLoginSuccess(true)
			} else {
				toast.error(res.data?.message || "Unexpected response")
			}

			console.log("Server response:", res.data)
		} catch (error) {
			if (error.response) {
				const errorMessage = error.response.data?.message || "An error occurred!"
				toast.error(errorMessage)
			} else if (error.request) {
				toast.error("Server did not respond. Please try again later.")
			} else {
				toast.error("An unexpected error occurred.")
			}
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
				<h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Teacher login</h2>
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
