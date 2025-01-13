import React from "react"
import moment from "moment"

const AttendanceTable = ({ schedule, attendanceData }) => {
	const formatDate = (datetime) => moment(datetime).format("DD-MM-YYYY")
	const today = moment().startOf("day")

	const uniqueDates = Array.from(new Set(schedule.map((entry) => formatDate(entry.datetime))))

	const uniqueStudents = Array.from(new Map(attendanceData.map((item) => [item.student_email, { name: item.name, userRoll: item.userRoll, email: item.student_email }])).values())

	// Process attendance data and calculate total attendance
	const processedData = uniqueStudents.map((student) => {
		// Track present count
		let presentCount = 0

		const status = uniqueDates.map((date) => {
			const isFutureDate = moment(date, "DD-MM-YYYY").isAfter(today)
			if (isFutureDate) return "" // No status for future dates

			const attendanceRecord = attendanceData.find((entry) => entry.student_email === student.email && entry.datetime === date)
			const status = attendanceRecord ? attendanceRecord.present_status : "A"

			// Increment present count for "P" statuses
			if (status === "P") presentCount++

			return status
		})

		return { ...student, status, presentCount }
	})

	const totalClasses = uniqueDates.filter((date) => !moment(date, "DD-MM-YYYY").isAfter(today)).length

	return (
		<div className="overflow-x-auto">
			<table className="min-w-full table-auto border-collapse">
				<thead>
					<tr className="border-b">
						<th className="px-4 py-2 text-left font-semibold text-gray-700">Student name & Id</th>
						{uniqueDates.map((date, index) => (
							<th key={index} className="px-4 py-2 text-center font-semibold text-gray-700">
								{date}
							</th>
						))}
						<th className="px-4 py-2 text-center font-semibold text-gray-700">Total</th>
					</tr>
				</thead>
				<tbody>
					{processedData.map((row, rowIndex) => (
						<tr key={rowIndex} className="border-b">
							<td className="px-4 py-2 font-medium text-gray-700">
								{row.name}
								<span className="text-xs block">{row.userRoll}</span>
							</td>
							{row.status.map((status, index) => (
								<td key={index} className="px-4 py-2 text-center">
									{status ? <span className={`inline-block w-6 h-6 rounded-full ${status === "P" ? "bg-green-500" : status === "A" ? "bg-red-500" : "bg-gray-200"} text-white`}>{status}</span> : <span className="inline-block w-6 h-6 rounded-full bg-gray-200"></span>}
								</td>
							))}
							<td className="px-4 py-2 text-center font-medium text-gray-700">
								{row.presentCount}/{totalClasses}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default AttendanceTable
