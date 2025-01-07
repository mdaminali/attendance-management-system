import React, { useState, useEffect } from "react"
import { Text, View, StyleSheet } from "react-native"
import { Link } from "expo-router"

import * as SecureStore from "expo-secure-store"
import { useRouter } from "expo-router"

export default function Index() {
	const router = useRouter()
	const [studenInfo, setStudentInfo] = useState()

	// useEffect(async () => {
	// 	let info = await SecureStore.getItemAsync("studentInfo")
	// 	console.log("info", info)
	// 	setStudentInfo(info)
	// }, [])

	// useEffect(async () => {
	// 	if (studenInfo) router.push("/home")
	// }, [studenInfo])

	return (
		<View style={styles.container}>
			{/* Welcome Message */}
			<Text style={styles.welcomeText}>Welcome to Attendance Management</Text>

			{/* App Description */}
			<Text style={styles.descriptionText}>Keep track of your attendance, manage schedules, and stay organized with ease.</Text>

			{/* Action Buttons */}
			<View style={styles.buttonContainer}>
				<Link href="/registration" style={styles.button}>
					<Text style={styles.buttonText}>Register</Text>
				</Link>
				<Link href="/login" style={styles.button}>
					<Text style={styles.buttonText}>Login</Text>
				</Link>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#F4F4F4",
	},
	welcomeText: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#333",
	},
	descriptionText: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 30,
		color: "#666",
	},
	buttonContainer: {
		flexDirection: "row",
		gap: 15,
	},
	button: {
		backgroundColor: "#4CAF50",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 5,
		marginBottom: 10,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		textAlign: "center",
	},
})
