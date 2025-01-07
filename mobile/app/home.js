import React, { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import * as SecureStore from "expo-secure-store"
import { useRouter } from "expo-router"

const Home = () => {
	const router = useRouter()
	// State for menu visibility
	const [menuVisible, setMenuVisible] = useState(false)
	const [currentMenu, setCurrentMenu] = useState("Home")

	// Menu items
	const menuItems = [{ key: "Home" }, { key: "Add course" }, { key: "Attendance" }, { key: "Notice" }]

	// Toggle menu visibility
	const toggleMenu = () => setMenuVisible(!menuVisible)

	// Logout handler
	const handleLogout = async () => {
		await SecureStore.deleteItemAsync("studentInfo")
		router.push("/index")
	}

	const handleMenuChange = (menu) => {
		setCurrentMenu(menu)
		toggleMenu()
	}

	return (
		<View style={styles.container}>
			{/* Header Section */}
			<View style={styles.header}>
				<View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
					<TouchableOpacity onPress={toggleMenu}>
						<Ionicons name="menu" size={30} color="#fff" />
					</TouchableOpacity>

					{/* App Name */}
					<Text style={styles.title}>AttendEase</Text>
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
				<View style={styles.body}>
					<Text style={styles.welcome}>Welcome to Add course!</Text>
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
})

export default Home
