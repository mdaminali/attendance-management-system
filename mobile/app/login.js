import React from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, StatusBar } from "react-native"
import { Link } from "expo-router"
import { Formik } from "formik"
import * as Yup from "yup"
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"
import axios from "axios"
import { Toast } from "toastify-react-native"
import * as SecureStore from "expo-secure-store"
import { useRouter } from "expo-router"

import * as Application from "expo-application"

// Validation schema using Yup
const validationSchema = Yup.object({
	email: Yup.string().email("Invalid email address").required("Email is required"),
	password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

const Login = () => {
	const router = useRouter()

	const handleLogin = async (values) => {
		let data = values

		const androidId = Application.getAndroidId()

		if (androidId) {
			data.androidId = androidId
		}

		console.log(data)

		try {
			const res = await axios.post("http://192.168.4.73:3001/api/studentLogin", data)
			console.log("data", res?.data)
			if (res?.data) {
				Toast.success(res.data?.message)
				await SecureStore.setItemAsync("studentInfo", JSON.stringify(res?.data?.user))
				router.push("/home")
			}

			// setData(response.data)
		} catch (err) {
			if (err.response && err.response.data && err.response.data.message) {
				Toast.error(err.response.data.message)
			} else {
				console.log(err?.message)
				Toast.error(err?.message || "An unknown error occurred.")
			}
		} finally {
			// setLoading(false)
		}
	}

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.containerTop} edges={["top"]}>
				<ScrollView>
					<View style={styles.container}>
						{/* Login Title */}
						<Text style={styles.title}>Login to Your Account</Text>

						{/* Formik Form */}
						<Formik initialValues={{ email: "", password: "" }} validationSchema={validationSchema} onSubmit={handleLogin}>
							{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
								<View style={styles.form}>
									{/* Email Input */}
									<TextInput style={styles.input} placeholder="Email" keyboardType="email-address" onChangeText={handleChange("email")} onBlur={handleBlur("email")} value={values.email} />
									{touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

									{/* Password Input */}
									<TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={handleChange("password")} onBlur={handleBlur("password")} value={values.password} />
									{touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

									{/* Submit Button */}
									<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
										<Text style={styles.buttonText}>Login</Text>
									</TouchableOpacity>
								</View>
							)}
						</Formik>

						{/* Link to Registration Page */}
						<View style={styles.registerLinkContainer}>
							<Text style={styles.linkText}>Don't have an account? </Text>
							<Link href="/registration" style={styles.registerLink}>
								Register
							</Link>
						</View>
					</View>
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
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#F4F4F4",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 30,
	},
	form: {
		width: "100%",
		marginBottom: 20,
	},
	input: {
		width: "100%",
		padding: 12,
		marginVertical: 10,
		backgroundColor: "#fff",
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "#ccc",
		fontSize: 16,
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
	registerLinkContainer: {
		flexDirection: "row",
		marginTop: 20,
	},
	linkText: {
		fontSize: 16,
		color: "#666",
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

export default Login
