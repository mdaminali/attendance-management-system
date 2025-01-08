import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import * as SecureStore from "expo-secure-store"
import { useRouter } from "expo-router"
import axios from "axios"

const Home = () => {
	const router = useRouter()
	// State for menu visibility
	const [menuVisible, setMenuVisible] = useState(false)
	const [currentMenu, setCurrentMenu] = useState("Home")
	const [courses, setCourses] = useState()

	// Menu items
	const menuItems = [{ key: "Home" }, { key: "Add course" }, { key: "Attendance" }, { key: "Notice" }]

	// Toggle menu visibility
	const toggleMenu = () => setMenuVisible(!menuVisible)

	// Logout handler
	const handleLogout = async () => {
		await SecureStore.deleteItemAsync("studentInfo")
		router.push("/login")
	}

	const handleMenuChange = (menu) => {
		setCurrentMenu(menu)
		toggleMenu()
	}

	const [selectedItems, setSelectedItems] = useState([])

	useEffect(() => {
		getCourses()
	}, [])

	const getCourses = async () => {
		try {
			const res = await axios.get(`http://192.168.4.111:3001/api/allCourses`)
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

	const toggleSelection = (code) => {
		if (selectedItems.includes(code)) {
			setSelectedItems(selectedItems.filter((item) => item !== code))
		} else {
			setSelectedItems([...selectedItems, code])
		}
	}

	const handleSubmit = () => {
		if (selectedItems.length === 0) {
			console.log("No Selection", "Please select at least one item.")
		} else {
			const selectedTitles = courses
				.filter((item) => selectedItems.includes(item.code))
				.map((item) => item.code)
				.join(", ")
			console.log("Selected Items", selectedTitles)
		}
	}

	const renderItem = ({ item }) => (
		<TouchableOpacity style={styles.checkboxContainer} onPress={() => toggleSelection(item.code)}>
			<View style={styles.checkbox}>{selectedItems.includes(item.code) && <View style={styles.checked} />}</View>
			<Text style={styles.label}>
				{item.code}: {item.title}
			</Text>
		</TouchableOpacity>
	)

	return (
		<View style={styles.container}>
			{/* Header Section */}
			<View style={styles.header}>
				<View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
					<TouchableOpacity onPress={toggleMenu}>
						<Ionicons name="menu" size={30} color="#fff" />
					</TouchableOpacity>

					{/* App Name */}
					<Text style={{ color: "white", fontSize: 20 }}>AttendEase</Text>
				</View>

				{/* Logout Button */}
				<TouchableOpacity onPress={handleLogout}>
					<Text style={styles.logout}>Logout</Text>
				</TouchableOpacity>
			</View>

			{currentMenu === "Home" && (
				<View style={styles.body}>
					<Text style={styles.welcome}>Welcome to AttendEase!</Text>
				</View>
			)}

			{currentMenu === "Add course" && (
				<View style={{ padding: 20 }}>
					<Text style={styles.title}>Select Your Courses</Text>

					<FlatList data={courses} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />

					<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
						<Text style={styles.submitButtonText}>Submit</Text>
					</TouchableOpacity>
				</View>
			)}

			{currentMenu === "Attendance" && (
				<View style={{ padding: 20 }}>
					<Text style={styles.title}>Submit your todays attendance</Text>

					<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
						<Text style={styles.submitButtonText}>Submit</Text>
					</TouchableOpacity>
				</View>
			)}

			{/* Sidebar Menu */}
			{menuVisible && (
				<View style={styles.sidebar}>
					{/* Close Icon */}
					<TouchableOpacity style={styles.closeIcon} onPress={toggleMenu}>
						<Ionicons name="close" size={30} color="#000" />
					</TouchableOpacity>

					{/* Menu Items */}
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
	checkboxContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderWidth: 2,
		borderColor: "#007AFF",
		borderRadius: 3,
		marginRight: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	checked: {
		width: 12,
		height: 12,
		backgroundColor: "#007AFF",
	},
	label: {
		fontSize: 16,
		color: "#333",
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

export default Home
