import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native"
import axios from "axios"
import { Toast } from "toastify-react-native"

export default function AddCourse({ courses, studentInfo, setStudentInfo }) {
	const [selectedItems, setSelectedItems] = useState([])

	const toggleSelection = (code) => {
		if (selectedItems.includes(code)) {
			setSelectedItems(selectedItems.filter((item) => item !== code))
		} else {
			setSelectedItems([...selectedItems, code])
		}
	}

	useEffect(() => {
		// console.log("studentInfo", studentInfo)
		if (!studentInfo) return
		let courses = studentInfo?.courses
		if (courses) {
			const data = courses.split(", ").map((course) => course.trim())
			setSelectedItems(data)
		}
	}, [studentInfo])

	console.log(selectedItems)

	const handleSubmit = async () => {
		if (selectedItems.length === 0) {
			Toast.error("No Selection. Please select at least one item.")
		} else {
			// const selectedTitles = courses
			// 	.filter((item) => selectedItems.includes(item.code))
			// 	.map((item) => item.code)
			// 	.join(", ")

			// console.log("Selected Items", selectedTitles)

			let data = {
				courses: selectedItems.join(", "),
				id: studentInfo?.id,
			}

			try {
				const res = await axios.post("http://192.168.4.102:3001/api/addCourseByStudent", data)
				// console.log("data", res?.data)
				if (res?.data) {
					Toast.success(res.data?.message)
					let updateData = studentInfo
					updateData.courses = data.courses
					setStudentInfo(updateData)

					// await SecureStore.setItemAsync("studentInfo", JSON.stringify(res?.data?.user))
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
	}

	// console.log("object", studentInfo)

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
	checkboxContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderWidth: 2,
		borderColor: "#32a852",
		borderRadius: 3,
		marginRight: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	checked: {
		width: 12,
		height: 12,
		backgroundColor: "#32a852",
	},
	label: {
		fontSize: 16,
		color: "#333",
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
		backgroundColor: "#32a852",
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
