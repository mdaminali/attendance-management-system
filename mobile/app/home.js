import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import * as SecureStore from "expo-secure-store"
import { useRouter } from "expo-router"
import axios from "axios"
import Attendance from "./components/Attendance"
import AddCourse from "./components/AddCourse"
import Notice from "./components/Notice"

export default function Home() {
	const router = useRouter()

	const [studentInfo, setStudentInfo] = useState()
	const [menuVisible, setMenuVisible] = useState(false)
	const [currentMenu, setCurrentMenu] = useState("Home")
	const [courses, setCourses] = useState()

	const menuItems = [{ key: "Home" }, { key: "Add course" }, { key: "Attendance" }, { key: "Notice" }]

	const toggleMenu = () => setMenuVisible(!menuVisible)

	const handleLogout = async () => {
		await SecureStore.deleteItemAsync("studentInfo")
		router.push("/login")
	}

	const getStudentInfo = async () => {
		let info = await SecureStore.getItemAsync("studentInfo")
		info && setStudentInfo(JSON.parse(info))
	}

	useEffect(() => {
		getStudentInfo()
	}, [])

	// useEffect(async () => {
	// 	if (!studentInfo) router.push("/home")
	// }, [studentInfo])

	const handleMenuChange = (menu) => {
		setCurrentMenu(menu)
		toggleMenu()
	}

	useEffect(() => {
		getCourses()
	}, [])

	const getCourses = async () => {
		try {
			const res = await axios.get(`http://192.168.4.102:3001/api/allCourses`)
			console.log("Server response:", res)

			if (res.data) {
				setCourses(res.data)
			} else {
				toast.error(res.data?.message || "Unexpected response")
			}

			// setData(response.data)
		} catch (err) {
			console.log(err)
			Toast.error(err?.message ? err?.message : "Something wrong")
			// setError("Failed to fetch data")
		} finally {
			// setLoading(false)
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
					<TouchableOpacity onPress={toggleMenu}>
						<Ionicons name="menu" size={30} color="#fff" />
					</TouchableOpacity>

					<Text style={{ color: "white", fontSize: 20 }}>AttendEase</Text>
				</View>

				<TouchableOpacity onPress={handleLogout}>
					<Text style={styles.logout}>Logout</Text>
				</TouchableOpacity>
			</View>

			{currentMenu === "Home" && (
				<View style={styles.body}>
					<Text style={styles.welcome}>Welcome to AttendEase!</Text>
				</View>
			)}

			{currentMenu === "Add course" && <AddCourse courses={courses} studentInfo={studentInfo} setStudentInfo={setStudentInfo} />}

			{currentMenu === "Attendance" && <Attendance courses={courses} studentInfo={studentInfo} setStudentInfo={setStudentInfo} />}
			{currentMenu === "Notice" && <Notice />}

			{menuVisible && (
				<View style={styles.sidebar}>
					<TouchableOpacity style={styles.closeIcon} onPress={toggleMenu}>
						<Ionicons name="close" size={30} color="#000" />
					</TouchableOpacity>

					<FlatList
						data={menuItems}
						renderItem={({ item }) => (
							<TouchableOpacity onPress={() => handleMenuChange(item.key)}>
								<Text style={styles.menuItem}>{item.key}</Text>
							</TouchableOpacity>
						)}
						keyExtractor={(item) => item.key}
					/>
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 15,
		paddingVertical: 20,
		backgroundColor: "#6f8093",
	},
	title: {
		color: "#fff",
		fontSize: 20,
		fontWeight: "bold",
	},
	logout: {
		color: "#fff",
		fontSize: 16,
		backgroundColor: "#4CAF50",
		padding: 5,
		borderRadius: 10,
	},
	body: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	welcome: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#333",
	},
	sidebar: {
		position: "absolute",
		top: 0,
		left: 0,
		width: 250,
		height: "100%",
		backgroundColor: "#fff",
		paddingTop: 40,
		elevation: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
	},
	closeIcon: {
		position: "absolute",
		top: 10,
		right: 10,
	},
	menuItem: {
		fontSize: 18,
		color: "#4CAF50",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#333",
		textAlign: "center",
	},

	submitButton: {
		marginTop: 20,
		backgroundColor: "#007AFF",
		padding: 15,
		borderRadius: 5,
		alignItems: "center",
	},
	submitButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
})
