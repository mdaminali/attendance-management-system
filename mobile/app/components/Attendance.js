import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native"
import { Toast } from "toastify-react-native"
import moment from "moment"
import * as Location from "expo-location"
import * as LocalAuthentication from "expo-local-authentication"
import axios from "axios"
import { calculateDistance } from "../../utils/getLocationDistance"

export default function Attendance({ courses, studentInfo, setStudentInfo }) {
	const [location, setLocation] = useState(null)
	const [activeButton, setActiveButton] = useState(null)
	const [schedules, setSchedules] = useState(null)
	const [todayAttendance, setTodayAttendance] = useState(null)

	console.log("todayAttendance", todayAttendance)

	const buetLatLong = {
		latitude: 23.726684,
		longitude: 90.388742,
		acceptDistance: 0.5,
	}

	useEffect(() => {
		;(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync()
			if (status !== "granted") {
				Toast.error("Permission to access location was denied")
				return
			}

			let currentLocation = await Location.getCurrentPositionAsync({})
			setLocation(currentLocation.coords)
		})()
	}, [])

	// console.log(location)

	useEffect(() => {
		if (!activeButton) return
		getSchedule()
		getAttendance()
	}, [activeButton])

	const getSchedule = async () => {
		try {
			const res = await axios.get(`http://192.168.4.102:3001/api/codeWiseSchedule?code=${activeButton}`)

			if (res.data) {
				setSchedules(res.data)
			} else {
				Toast.error(res.data?.message || "Unexpected response")
			}
		} catch (err) {
			Toast.error(err?.message ? err?.message : "Something went wrong")
		}
	}

	const getAttendance = async () => {
		try {
			const todayDate = moment().format("DD-MM-YYYY")
			const res = await axios.get(`http://192.168.4.102:3001/api/studentAndCodeWiseAttendance?student_email=${studentInfo?.email}&course_code=${activeButton}&datetime=${todayDate}`)

			if (res?.data?.length > 0) {
				setTodayAttendance(res.data)
			} else {
				setTodayAttendance(null)
			}
		} catch (err) {
			Toast.error(err?.message ? err?.message : "Something went wrong")
		}
	}

	const classDetails = schedules?.[0]?.classDetails ? JSON.parse(schedules?.[0]?.classDetails) : []

	// console.log(classDetails)

	const now = moment() // Current time using Moment.js

	const classInProgress = classDetails.find((classDetail) => {
		const classStart = moment(classDetail.datetime)
		const classEnd = classStart.clone().add(3, "hours") // Add 3 hours for class duration
		return now.isBetween(classStart, classEnd)
	})

	const nextClass = classDetails.find((classDetail) => {
		const classStart = moment(classDetail.datetime)
		return now.isBefore(classStart)
	})

	const registerFingerprint = async () => {
		let distance = calculateDistance(buetLatLong?.latitude, buetLatLong?.longitude, location?.latitude, location?.longitude)

		if (distance > buetLatLong?.acceptDistance) return Toast.error("Attendance is not allowed outside the BUET campus")

		try {
			const hasHardware = await LocalAuthentication.hasHardwareAsync()
			if (!hasHardware) {
				Alert.alert("Error", "Device does not support fingerprint scanning")
				return
			}

			const biometricTypes = await LocalAuthentication.supportedAuthenticationTypesAsync()
			if (!biometricTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
				Alert.alert("Error", "Fingerprint not supported")
				return
			}

			const result = await LocalAuthentication.authenticateAsync({
				promptMessage: "Scan your fingerprint to submit attendance",
			})

			if (result.success) {
				let data = {
					course_code: activeButton,
					student_email: studentInfo?.email,
					present_status: "P",
					datetime: moment().format("DD-MM-YYYY"),
				}

				try {
					const res = await axios.post("http://192.168.4.102:3001/api/attendanceSubmit", data)
					if (res?.data) {
						Toast.success(res.data?.message)
						getAttendance()
					}
				} catch (err) {
					Toast.error(err?.message ? err?.message : "Something wrong")
				}
			} else {
				Alert.alert("Error", "Fingerprint registration failed")
			}
		} catch (error) {
			Alert.alert("Error", "An error occurred while processing fingerprint")
		}
	}

	return (
		<View>
			<View>
				<Text style={{ fontSize: 16, textAlign: "center", marginTop: 20 }}>Select a course code from below</Text>
			</View>
			<View style={styles.container}>
				{studentInfo?.courses?.split(", ")?.map((course, index) => (
					<TouchableOpacity key={index} style={[styles.button, activeButton === course && styles.activeButton]} onPress={() => setActiveButton(course)}>
						<Text style={[styles.buttonText, activeButton === course && styles.activeText]}>{course}</Text>
					</TouchableOpacity>
				))}
			</View>

			{activeButton !== null &&
				classInProgress &&
				(todayAttendance?.length > 0 ? (
					<View>
						<Text style={{ fontWeight: "bold", textAlign: "center", fontSize: 20, marginTop: 20 }}>Submittion done.</Text>
						<Text style={styles.title2}>The attendance submissions for today's session of this course have already been completed.</Text>

						<Text style={styles.message}>
							Your next class is on <Text style={{ fontWeight: "bold" }}>{moment(nextClass.datetime).format("dddd, MMMM Do YYYY, h:mm A")}</Text>.
						</Text>
					</View>
				) : (
					<View style={{ padding: 20 }}>
						<Text style={styles.title}>Submit your today's attendance</Text>

						<TouchableOpacity style={styles.submitButton} onPress={registerFingerprint}>
							<Text style={styles.submitButtonText}>Submit</Text>
						</TouchableOpacity>
					</View>
				))}

			{activeButton !== null && !classInProgress && (
				<View style={{ padding: 20 }}>
					<Text style={styles.message}>No class is currently ongoing.</Text>
					{nextClass && (
						<Text style={styles.message}>
							Your next class is on <Text style={{ fontWeight: "bold" }}>{moment(nextClass.datetime).format("dddd, MMMM Do YYYY, h:mm A")}</Text>.
						</Text>
					)}
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 20,
	},
	button: {
		padding: 10,
		margin: 5,
		borderWidth: 1,
		borderColor: "#000",
		borderRadius: 5,
		backgroundColor: "#fff",
	},
	activeButton: {
		backgroundColor: "#32a852",
		borderColor: "#32a852",
	},
	buttonText: {
		color: "#000",
	},
	activeText: {
		color: "#fff",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#333",
		textAlign: "center",
	},
	title2: {
		fontSize: 16,
		fontWeight: "400",
		marginBottom: 20,
		color: "#333",
		textAlign: "center",
		padding: 10,
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
	message: {
		fontSize: 16,
		marginVertical: 10,
		textAlign: "center",
		padding: 10,
	},
})
