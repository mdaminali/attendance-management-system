import React, { useState } from "react"
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native"
import * as LocalAuthentication from "expo-local-authentication" // For Expo projects

const HomeScreen = () => {
	const [name, setName] = useState("")
	const [id, setId] = useState("")
	const [fingerData, setFingerData] = useState("")

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
				const uniqueCode = `fingerprint_${Date.now()}` // Generating a unique ID as a placeholder
				setFingerData(uniqueCode)
				Alert.alert("Success", "Fingerprint registered successfully!")
				// Send data to the server
				console.log({ name, id, fingerData: uniqueCode })
			} else {
				Alert.alert("Error", "Fingerprint registration failed")
			}
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Register</Text>
			<TextInput placeholder="Enter Name" style={styles.input} value={name} onChangeText={setName} />
			<TextInput placeholder="Enter ID" style={styles.input} value={id} onChangeText={setId} />
			<Button title="Register Fingerprint" onPress={registerFingerprint} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: "center", alignItems: "center" },
	title: { fontSize: 24, marginBottom: 20 },
	input: { borderWidth: 1, padding: 10, margin: 10, width: "80%" },
})

export default HomeScreen
