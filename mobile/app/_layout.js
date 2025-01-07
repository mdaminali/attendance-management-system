import { Stack } from "expo-router"
import ToastManager, { Toast } from "toastify-react-native"
import { View } from "react-native"

export default function RootLayout() {
	return (
		<>
			<ToastManager position="bottom" animationStyle={"rightInOut"} />

			<Stack>
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen name="registration" />
				<Stack.Screen name="login" />
				<Stack.Screen name="home" options={{ headerShown: false }} />
			</Stack>
		</>
	)
}
