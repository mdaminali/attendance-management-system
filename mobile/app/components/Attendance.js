import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import * as Location from "expo-location"
import { Toast } from "toastify-react-native"

import * as LocalAuthentication from "expo-local-authentication"

import * as SecureStore from "expo-secure-store"
import { useRouter } from "expo-router"
import axios from "axios"

import { calculateDistance } from "../../utils/getLocationDistance"

export default function Attendance() {
	const [location, setLocation] = useState(null)

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

	const buetLatLong = {
		latitude: "23.726617",
		longitude: "90.388698",
		radiusKm: 1,
	}

	const registerFingerprint = async () => {
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
				promptMessage: "Scan your fingerprint to register",
			})
			console.log(result)

			if (result.success) {
				console.log(location)
				Alert.alert("Success", "Fingerprint registered successfully!")
				// Send data to the server
				// console.log({ name, id, fingerData: uniqueCode })
			} else {
				Alert.alert("Error", "Fingerprint registration failed")
			}
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<View style={{ padding: 20 }}>
			<Text style={styles.title}>Submit your todays attendance</Text>

			<TouchableOpacity style={styles.submitButton} onPress={registerFingerprint}>
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
