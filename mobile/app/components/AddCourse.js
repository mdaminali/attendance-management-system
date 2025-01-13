import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import * as SecureStore from "expo-secure-store"
import { useRouter } from "expo-router"
import axios from "axios"

export default function AddCourse({ courses }) {
	const [selectedItems, setSelectedItems] = useState([])

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
		<View style={{ padding: 20 }}>
			<Text style={styles.title}>Select Your Courses</Text>

			<FlatList data={courses} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />

			<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
				<Text style={styles.submitButtonText}>Submit</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
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
