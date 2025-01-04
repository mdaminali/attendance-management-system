const express = require("express")
const mysql = require("mysql2")

const app = express()
const PORT = 3001

// Middleware to parse JSON requests
app.use(express.json())

// Create a connection to the database
const db = mysql.createConnection({
	host: "localhost",
	user: "root", // Replace with your MySQL username
	password: "", // Replace with your MySQL password
	database: "attendance_management", // Name of your database
})

// Connect to the database
db.connect((err) => {
	if (err) {
		console.error("Error connecting to MySQL:", err)
		process.exit(1)
	}
	console.log("Connected to MySQL database")
})

// Create a GET route to fetch all students
app.get("/students", (req, res) => {
	const query = "SELECT * FROM students"

	db.query(query, (err, results) => {
		if (err) {
			res.status(500).json({ error: "Failed to fetch students" })
		} else {
			res.status(200).json(results)
		}
	})
})

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
