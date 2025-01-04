const express = require("express")
const mysql = require("mysql2")

app.use(bodyParser.json())

const cors = require("cors")

const app = express()

app.use(cors())

const corsOptions = {
	origin: "http://localhost:3001", // Replace with the frontend's origin
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true, // Allow cookies and other credentials
}

app.use(cors(corsOptions))

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

app.post("/api/adminLogin", (req, res) => {
	// Extract data sent from the frontend
	const { email, password } = req.body

	// Print the data to the console
	console.log("Email:", email)
	console.log("Password:", password)

	// Respond to the frontend
	res.status(200).json({
		message: "Data received successfully!",
		receivedData: { email, password },
	})
})

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
