import { Geist, Geist_Mono } from "next/font/google"
import { ToastContainer } from "react-toastify"

import "./globals.css"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata = {
	title: "AttendEase | Easy attendance system",
	description: "Easy attendance system app",
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				{children}
				<ToastContainer />
			</body>
		</html>
	)
}
