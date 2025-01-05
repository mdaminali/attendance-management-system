import Link from "next/link"

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
			<div className="text-center">
				<h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">BUET Attendance Management System</h1>
				<p className="text-gray-600 text-lg md:text-xl mb-10">Streamline attendance tracking with efficiency and precision.</p>
				<div className="flex justify-center space-x-4">
					<Link href="/admin/login">
						<span className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">Login as Admin</span>
					</Link>
					<Link href="/teacher/login">
						<span className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">Login as Teacher</span>
					</Link>
				</div>
			</div>
		</div>
	)
}
