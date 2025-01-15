import React from "react"
import { View, Text, ScrollView, StyleSheet } from "react-native"

const Notice = () => {
	const demoNotices = [
		{
			id: 2,
			title: "Class Schedule Update",
			description: "The Database and Storage security class has been rescheduled to 6:00 PM on Friday.",
		},
		{
			id: 3,
			title: "Holiday Announcement",
			description: "Next Wednesday, the 29th, is declared a holiday due to maintenance work.",
		},
		{
			id: 4,
			title: "Exam Notification",
			description: "Mid-term exams will start from next Monday. Please collect your admit card from the office.",
		},
		{
			id: 5,
			title: "Classroom Change",
			description: "Database and Storage security class on Wednesday will be held in Room 738 instead of Room 707.",
		},
	]

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Notice</Text>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				{demoNotices.map((notice) => (
					<View key={notice.id} style={styles.card}>
						<Text style={styles.cardTitle}>{notice.title}</Text>
						<Text style={styles.cardDescription}>{notice.description}</Text>
					</View>
				))}
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f4f4f4",
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginTop: 20,
		marginBottom: 10,
		color: "#333",
	},
	scrollContainer: {
		padding: 10,
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 15,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 5,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
		borderLeftWidth: 5,
		borderLeftColor: "#32a852",
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 5,
	},
	cardDescription: {
		fontSize: 14,
		color: "#555",
	},
})

export default Notice
