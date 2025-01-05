"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { redirect, usePathname, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import axios from "axios"

import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup
	.object({
		email: yup.string().email("Invalid email address").required("Email is required"),
		password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
	})
	.required()

const Teachers = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [open, setOpen] = useState(false)
	const [deleteItem, setDeleteItem] = useState()

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: yupResolver(schema),
	})

	const handleOpen = () => setOpen(!open)

	const [tableData, setTableData] = useState([
		{ id: 1, email: "user1@example.com", password: "password1" },
		{ id: 2, email: "user2@example.com", password: "password2" },
		{ id: 3, email: "user3@example.com", password: "password3" },
	])

	const onSubmit = async (data) => {
		console.log("Form data:", data)
		handleOpen()
	}

	const handleEdit = () => {
		handleOpen()
	}

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedAdminInfo = localStorage.getItem("adminInfo")
			if (storedAdminInfo) {
				let jsonData = JSON.parse(storedAdminInfo)
				if (jsonData?.type === "admin") {
					// setLoginSuccess(true)
				}
			}
		}
	}, [])

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
							<Link href="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-700 ">
								Home
							</Link>
						</li>
						<li>
							<Link href="/admin/dashboard/teachers" className="block px-4 py-2 hover:bg-gray-700 bg-gray-700">
								Teachers
							</Link>
						</li>
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
				<div className="mb-6 flex justify-between items-center">
					<h1 className="text-3xl font-semibold">Teachers</h1>
					<button onClick={handleOpen} className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
						Add
					</button>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="min-w-full table-auto border-collapse">
						<thead className="bg-gray-200">
							<tr>
								<th className="px-4 py-2 text-left font-semibold">ID</th>
								<th className="px-4 py-2 text-left font-semibold">Email</th>
								<th className="px-4 py-2 text-left font-semibold">Password</th>
								<th className="px-4 py-2 text-left font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{tableData.map((row) => (
								<tr key={row.id} className="border-b">
									<td className="px-4 py-2">{row.id}</td>
									<td className="px-4 py-2">{row.email}</td>
									<td className="px-4 py-2">{row.password}</td>
									<td className="px-4 py-2 flex space-x-2">
										{/* Edit Icon */}
										{/* Correct Edit Icon (Pencil) */}
										<button onClick={() => handleEdit(row.id)} className="text-blue-600 w-4 hover:text-blue-800">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
												<path
													fill="#74C0FC"
													d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"
												/>
											</svg>
										</button>
										{/* Delete Icon */}
										<button onClick={() => setDeleteItem(row.id)} className="text-red-600 hover:text-red-800">
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
											</svg>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<Dialog open={open} handler={handleOpen}>
				<DialogHeader>Add/Edit teacher</DialogHeader>
				<DialogBody>
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
				</DialogBody>
				<DialogFooter>
					<Button variant="text" color="red" onClick={handleOpen} className="mr-1">
						<span>Cancel</span>
					</Button>
					<Button variant="gradient" color="green" onClick={handleSubmit(onSubmit)}>
						<span>Submit</span>
					</Button>
				</DialogFooter>
			</Dialog>

			<Dialog open={deleteItem ? true : false} handler={() => setDeleteItem(deleteItem ? null : deleteItem)}>
				<DialogHeader>Account remove</DialogHeader>
				<DialogBody>Are you sure you want to delete this item?</DialogBody>
				<DialogFooter>
					<Button variant="text" color="gray" onClick={() => setDeleteItem(null)} className="mr-1">
						<span>Cancel</span>
					</Button>
					<Button variant="gradient" color="red" onClick={handleSubmit(onSubmit)}>
						<span>Submit</span>
					</Button>
				</DialogFooter>
			</Dialog>
		</div>
	)
}

export default Teachers
