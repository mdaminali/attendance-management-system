const express = require("express")
const mysql = require("mysql2")
const bodyParser = require("body-parser")

const cors = require("cors")

const app = express()

app.use(bodyParser.json())
app.use(cors())

const corsOptions = {
	origin: "http://localhost:3000", // Replace with the frontend's origin
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true, // Allow cookies and other credentials
}

app.use(cors(corsOptions))
app.use(express.json())

const PORT = 3001

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "attendance_management",
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

app.post("/api/adminLogin", (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required!" })
	}

	const query = "SELECT * FROM admins WHERE email = ? AND password = ?" // Password checking for simplicity here
	db.query(query, [email, password], (err, result) => {
		if (err) {
			console.error("Database error:", err)
			return res.status(500).json({ message: "Internal server error" })
		}

		if (result.length > 0) {
			// Successful login
			res.status(200).json({ message: "Login successful!", user: result[0]?.email, type: "admin" })
		} else {
			// User not found
			res.status(404).json({ message: "User does not exist in the database." })
		}
	})
})

app.post("/api/teacherAdd", (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required!" })
	}

	const query = "INSERT INTO teachers (email, password) VALUES (?, ?)"
	db.query(query, [email, password], (err, result) => {
		console.log(result)
		if (err) {
			console.error("Database error:", err)
			return res.status(500).json({ message: "Internal server error" })
		}

		if (result?.insertId > 0) {
			// Successful login
			res.status(200).json({ message: "Add successfully!" })
		} else {
			// User not found
			res.status(404).json({ message: "Something wrong. Please try again." })
		}
	})
})

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
