"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { redirect, usePathname, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import axios from "axios"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const Dashboard = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	// const [redirectToLogin, setRedirectToLogin] = useState(false)
	const [students, setStudents] = useState()
	const [teachers, setTeachers] = useState()
	const [attendances, setAttendances] = useState()

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedAdminInfo = localStorage.getItem("adminInfo")
			if (!storedAdminInfo) return redirect("/admin/login")
			getAllStudents()
		}
	}, [])

	const getAllStudents = async () => {
		try {
			const res = await axios.get(`http://localhost:3001/api/students`)
			const teacherRes = await axios.get(`http://localhost:3001/api/teachers`)
			const attendancesRes = await axios.get(`http://localhost:3001/api/attendances`)

			if (res.data?.length > 0) {
				setStudents(res.data)
			}
			if (teacherRes.data?.length > 0) {
				setTeachers(teacherRes.data)
			}

			if (attendancesRes.data?.length > 0) {
				setAttendances(attendancesRes.data)
			}
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

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen)
	}

	const handleSignOut = () => {
		localStorage.removeItem("adminInfo")
		toast.success("Signed Out")
		redirect("/")
	}

	return (
		<div className="flex h-screen flex-col">
			{/* Header */}
			<header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
				{/* Hamburger Icon (Mobile only) */}
				<div className="md:hidden flex items-center">
					<button onClick={toggleSidebar} className="text-gray-800 p-2">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>

				{/* Logo or Title */}
				<div className="text-xl font-semibold">Dashboard</div>

				{/* Right side (Hello, Amin + Sign Out button) */}
				<div className="flex items-center space-x-4">
					<div className="text-sm">Hello, Admin</div>
					<button onClick={handleSignOut} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">
						Sign Out
					</button>
				</div>
			</header>

			{/* Sidebar */}
			<div className={`bg-gray-800 text-white fixed top-0 left-0 w-64 h-full z-50 transform md:transform-none transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
				<div className="p-4 text-xl font-semibold">Dashboard</div>
				<nav>
					<ul>
						<li>
							<Link href="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-700 bg-gray-700">
								Home
							</Link>
						</li>
						<li>
							<Link href="/admin/dashboard/teachers" className="block px-4 py-2 hover:bg-gray-700">
								Teachers
							</Link>
						</li>
						{/* <li>
							<Link href="#" className="block px-4 py-2 hover:bg-gray-700">
								Profile
							</Link>
						</li> */}
					</ul>
				</nav>

				{/* Close Button (Mobile only) */}
				<div className="absolute top-4 right-4 md:hidden">
					<button onClick={toggleSidebar} className="text-white p-2">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 bg-gray-100 p-6 ml-0 md:ml-64 transition-all duration-300">
				{/* Dashboard Content */}
				<div className="mb-6">
					<h1 className="text-3xl font-semibold">Welcome to your Dashboard</h1>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{/* Card 1 */}
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h2 className="text-xl font-semibold">Total Students</h2>
						<p className="text-4xl font-bold mt-2">{students?.length}</p>
					</div>
					{/* Card 2 */}
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h2 className="text-xl font-semibold">Total Teachers</h2>
						<p className="text-4xl font-bold mt-2">{teachers?.length}</p>
					</div>
					{/* Card 3 */}
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h2 className="text-xl font-semibold">Today total present</h2>
						<p className="text-4xl font-bold mt-2">{attendances?.length}</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Dashboard
