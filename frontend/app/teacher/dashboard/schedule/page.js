"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { redirect, usePathname, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import axios from "axios"

import { Radio } from "@material-tailwind/react"

import moment from "moment"

import DateTimePicker from "react-datetime-picker"
import "react-datetime-picker/dist/DateTimePicker.css"
import "react-calendar/dist/Calendar.css"
import "react-clock/dist/Clock.css"

import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react"

import CustomLoader from "@/app/components/CustomLoader"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup
	.object({
		email: yup.string().email("Invalid email address").required("Email is required"),
		code: yup.string().max(50, "Course code must be at most 50 characters").required("Course code is required"),
		title: yup.string().max(255, "Course title must be at most 255 characters").required("Course title is required"),
	})
	.required()

const Schedule = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [open, setOpen] = useState(false)
	const [deleteItem, setDeleteItem] = useState()
	const [loading, setLoading] = useState(false)
	const [allSchedule, setAllSchedule] = useState()
	const [teacherInfo, setTeacherInfo] = useState()

	const [value, onChange] = useState(new Date())

	console.log(value)
	const formattedDate = moment(value, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ").format("YYYY-MM-DD HH:mm:ss")

	console.log(formattedDate)

	const [activeButton, setActiveButton] = useState(null)

	const [allCourses, setAllCourses] = useState()

	const [schedule, setSchedule] = useState([{ datetime: new Date(), class_type: "offline" }])

	console.log("allCourses", allCourses)

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: yupResolver(schema),
		values: {
			email: teacherInfo?.user,
		},
	})

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedTeacherInfo = localStorage.getItem("teacherInfo")
			if (!storedTeacherInfo) {
				redirect("/teacher/login")
			} else {
				setTeacherInfo(JSON.parse(storedTeacherInfo))
			}
		}
	}, [])

	useEffect(() => {
		getCourses()
	}, [teacherInfo])

	const handleClick = async (button) => {
		console.log(button)

		setActiveButton(button)
	}

	useEffect(() => {
		if (activeButton === null) return
		getSchedule()
	}, [activeButton])

	const getSchedule = async () => {
		try {
			const res = await axios.get(`http://localhost:3001/api/codeWiseSchedule?code=${allCourses?.[activeButton]?.code}`)
			console.log("Server response:", res)

			if (res.data) {
				setSchedule(res.data?.[0]?.classDetails && JSON.parse(res.data?.[0]?.classDetails))
			} else {
				toast.error(res.data?.message || "Unexpected response")
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

	console.log(teacherInfo)

	const handleOpen = () => setOpen(!open)

	const onSubmit = async (data) => {
		console.log("Form data:", data)
		const res = await axios.post("http://localhost:3001/api/courseAdd", data)

		if (res?.data) {
			toast.success("Add successfully!")
			handleOpen()
			// getSchedule()
			setValue("email", "")
			setValue("password", "")
		}
	}

	const getCourses = async () => {
		// if (!teacherInfo) return toast.error("Please login first.")
		if (!teacherInfo) return
		try {
			const res = await axios.get(`http://localhost:3001/api/teacherWiseCourses?email=${teacherInfo?.user}`)
			console.log("Server response:", res)

			if (res.data) {
				setAllCourses(res.data)
			} else {
				toast.error(res.data?.message || "Unexpected response")
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

	const handleDeleteSubmit = async () => {
		const body = {
			id: deleteItem,
		}
		const res = await axios.delete("http://localhost:3001/api/courseDelete", { data: body })

		console.log(res)

		if (res?.data) {
			toast.success("Delete successfully!")
			setDeleteItem(null)
			// getSchedule()
		}
	}

	const handleScheduleAdd = () => {
		setSchedule((prevSchedule) => [...prevSchedule, { datetime: new Date(), class_type: "offline" }])
	}

	console.log(schedule)

	const handleScheduleSubmit = async () => {
		// console.log(allCourses?.[activeButton]?.code)

		let data = {
			code: allCourses?.[activeButton]?.code,
			classDetails: JSON.stringify(schedule),
		}

		const res = await axios.post("http://localhost:3001/api/scheduleAdd", data)

		if (res?.data) {
			toast.success("Add successfully!")
		}
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
							<Link href="/teacher/dashboard" className="block px-4 py-2 hover:bg-gray-700 ">
								Home
							</Link>
						</li>
						<li>
							<Link href="/teacher/dashboard/courses" className="block px-4 py-2 hover:bg-gray-700 ">
								Courses
							</Link>
						</li>
						<li>
							<Link href="/teacher/dashboard/schedule" className="block px-4 py-2 hover:bg-gray-700 bg-gray-700">
								Schedule
							</Link>
						</li>
						<li>
							<Link href="/teacher/dashboard/attendace" className="block px-4 py-2 hover:bg-gray-700">
								Attendace
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
				<p className="mb-2">Click a course from below</p>

				<div style={{ display: "flex", gap: "10px" }}>
					{allCourses?.map((item, index) => (
						<button
							key={index}
							onClick={() => handleClick(index)}
							style={{
								padding: "10px 20px",
								backgroundColor: activeButton === index ? "#b1daff" : "#f0f0f0",
								color: activeButton === index ? "green" : "black",
								border: "1px solid #ccc",
								borderRadius: "4px",
								cursor: "pointer",
							}}>
							Course code:{item?.code}, Course title:{item?.title}
						</button>
					))}
				</div>

				{activeButton !== null && (
					<>
						<div className="mt-5">
							<h1 className="text-3xl font-semibold">Schedule</h1>
						</div>

						{loading ? (
							<div className="text-center py-5">
								<CustomLoader />
							</div>
						) : (
							<div className="space-y-4">
								{schedule?.length > 0 &&
									schedule.map((item, index) => (
										<div key={index} className="flex items-center gap-6 px-4 py-2 bg-gray-50 shadow rounded-lg">
											{/* Date and Time Section */}
											<div className="w-1/2">
												<p className="mb-2 text-sm font-semibold text-gray-700">Date and Time</p>
												<DateTimePicker
													onChange={(newDate) => {
														// Update the datetime for the current item
														const updatedSchedule = [...schedule]
														updatedSchedule[index] = { ...updatedSchedule[index], datetime: newDate }
														setSchedule(updatedSchedule)
													}}
													value={item.datetime}
												/>
											</div>

											{/* Class Type Section */}
											<div className="w-1/3">
												<p className="mb-2 text-sm font-semibold text-gray-700">Class Type</p>
												<div className="flex gap-6">
													<label className="flex items-center gap-2">
														<input
															type="radio"
															name={`type-${index}`} // Ensure unique name for each group
															value="Offline"
															checked={item.class_type === "Offline"}
															onChange={() => {
																const updatedSchedule = [...schedule]
																updatedSchedule[index] = { ...updatedSchedule[index], class_type: "Offline" }
																setSchedule(updatedSchedule)
															}}
														/>
														<span className="text-sm text-gray-600">Offline</span>
													</label>
													<label className="flex items-center gap-2">
														<input
															type="radio"
															name={`type-${index}`} // Ensure unique name for each group
															value="Online"
															checked={item.class_type === "Online"}
															onChange={() => {
																const updatedSchedule = [...schedule]
																updatedSchedule[index] = { ...updatedSchedule[index], class_type: "Online" }
																setSchedule(updatedSchedule)
															}}
														/>
														<span className="text-sm text-gray-600">Online</span>
													</label>
												</div>
											</div>

											{/* Delete Button */}
											<div className="w-auto">
												<button
													onClick={() => {
														const updatedSchedule = schedule.filter((_, idx) => idx !== index)
														setSchedule(updatedSchedule)
													}}
													className="text-red-600 hover:text-red-800 transition duration-200"
													aria-label="Delete">
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
													</svg>
												</button>
											</div>
										</div>
									))}

								{/* Add Button */}
								<div className="flex justify-between">
									<button onClick={handleScheduleAdd} className="px-6 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-200">
										Add
									</button>
									<button onClick={handleScheduleSubmit} className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-200">
										Submit
									</button>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default Schedule
