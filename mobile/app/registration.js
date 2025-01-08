import React from "react"
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView, StatusBar } from "react-native"
import { Formik } from "formik"
import * as Yup from "yup"
import { Link } from "expo-router"
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"
import axios from "axios"
import { Toast } from "toastify-react-native"

import { useRouter } from "expo-router"

// Validation Schema
const validationSchema = Yup.object().shape({
	name: Yup.string().required("Name is required"),
	userRoll: Yup.string().required("User Roll is required"),
	email: Yup.string().email("Invalid email address").required("Email is required"),
	password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

const Registration = () => {
	const router = useRouter()

	const handleSubmit = async (values) => {
		console.log(values)
		try {
			const res = await axios.post("http://192.168.4.111:3001/api/studentAdd", values)
			console.log("data", res?.data)
			if (res?.data) {
				Toast.success(res.data?.message)
				router.push("/login")
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
		<SafeAreaProvider>
			<SafeAreaView style={styles.containerTop} edges={["top"]}>
				<ScrollView>
					<Formik initialValues={{ name: "", userRoll: "", email: "", password: "" }} onSubmit={handleSubmit} validationSchema={validationSchema}>
						{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
							<View style={styles.container}>
								{/* Registration Title */}
								<Text style={styles.title}>Registration</Text>

								{/* Name Field */}
								<View style={styles.inputContainer}>
									<Text style={styles.label}>Name</Text>
									<TextInput style={styles.input} onChangeText={handleChange("name")} onBlur={handleBlur("name")} value={values.name} placeholder="Enter your name" />
									{touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
								</View>

								{/* User Roll Field */}
								<View style={styles.inputContainer}>
									<Text style={styles.label}>User Roll</Text>
									<TextInput style={styles.input} onChangeText={handleChange("userRoll")} onBlur={handleBlur("userRoll")} value={values.userRoll} placeholder="Enter your roll" />
									{touched.userRoll && errors.userRoll && <Text style={styles.error}>{errors.userRoll}</Text>}
								</View>

								{/* Email Field */}
								<View style={styles.inputContainer}>
									<Text style={styles.label}>Email</Text>
									<TextInput style={styles.input} onChangeText={handleChange("email")} onBlur={handleBlur("email")} value={values.email} placeholder="Enter your email" keyboardType="email-address" />
									{touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
								</View>

								{/* Password Field */}
								<View style={styles.inputContainer}>
									<Text style={styles.label}>Password</Text>
									<TextInput style={styles.input} onChangeText={handleChange("password")} onBlur={handleBlur("password")} value={values.password} placeholder="Enter your password" secureTextEntry />
									{touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
								</View>

								<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
									<Text style={styles.buttonText}>Register</Text>
								</TouchableOpacity>

								{/* Login Link */}
								<View style={styles.registerLinkContainer}>
									<Text style={styles.linkText}>Have an account? </Text>
									<Link href="/login" style={styles.registerLink}>
										Login
									</Link>
								</View>
							</View>
						)}
					</Formik>
				</ScrollView>
			</SafeAreaView>
		</SafeAreaProvider>
	)
}

const styles = StyleSheet.create({
	containerTop: {
		flex: 1,
		// paddingTop: StatusBar.currentHeight,
	},
	container: {
		padding: 16,
		backgroundColor: "#fff",
		flex: 1,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 24,
		color: "#333",
		marginTop: 40, // Add specific margin top for title to give space at the top
	},
	inputContainer: {
		marginBottom: 16,
	},
	label: {
		marginBottom: 8,
		fontSize: 14,
		fontWeight: "bold",
		color: "#333",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 4,
		padding: 12,
		fontSize: 16,
	},
	error: {
		color: "#ff0000",
		marginTop: 4,
		fontSize: 12,
	},
	submitButton: {
		backgroundColor: "#4CAF50",
		paddingVertical: 12,
		paddingHorizontal: 30,
		borderRadius: 5,
		marginTop: 20,
	},
	buttonText: {
		color: "white",
		fontSize: 18,
		textAlign: "center",
	},
	loginLink: {
		marginTop: 30,
		textAlign: "center",
		fontSize: 14,
		color: "#666",
	},
	linkText: {
		fontSize: 16,
		color: "#666",
	},
	registerLinkContainer: {
		flexDirection: "row",
		marginTop: 20,
	},
	registerLink: {
		fontSize: 16,
		color: "#4CAF50",
		fontWeight: "bold",
	},
	errorText: {
		color: "red",
		fontSize: 12,
		marginBottom: 10,
	},
})

export default Registration
