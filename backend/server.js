const express = require("express")
const mysql = require("mysql2")
const bodyParser = require("body-parser")

const cors = require("cors")

const app = express()

app.use(bodyParser.json())
app.use(cors())

const corsOptions = {
	origin: "*", // Replace with the frontend's origin
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

	const query = "SELECT * FROM admins WHERE email = ? AND password = ?"
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

app.get("/api/teachers", (req, res) => {
	const query = "SELECT * FROM teachers"

	db.query(query, (err, results) => {
		if (err) {
			res.status(500).json({ error: "Failed to fetch teachers" })
		} else {
			res.status(200).json(results)
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

app.delete("/api/teacherDelete", (req, res) => {
	const { id } = req.body

	if (!id) {
		return res.status(400).json({ message: "ID is required!" })
	}

	const query = "DELETE from teachers where id=?"
	db.query(query, [id], (err, result) => {
		console.log(result)
		if (err) {
			console.error("Database error:", err)
			return res.status(500).json({ message: "Internal server error" })
		}

		if (result?.affectedRows > 0) {
			// Successful login
			res.status(200).json({ message: "Delete successfully!" })
		} else {
			res.status(404).json({ message: "Something wrong. Please try again." })
		}
	})
})

// Teacher page login
app.post("/api/teacherLogin", (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required!" })
	}

	const query = "SELECT * FROM teachers WHERE email = ? AND password = ?"
	db.query(query, [email, password], (err, result) => {
		if (err) {
			console.error("Database error:", err)
			return res.status(500).json({ message: "Internal server error" })
		}

		if (result.length > 0) {
			// Successful login
			res.status(200).json({ message: "Login successful!", user: result[0]?.email, type: "teacher" })
		} else {
			// User not found
			res.status(404).json({ message: "User does not exist in the database." })
		}
	})
})

// all course related api

app.get("/api/courses", (req, res) => {
	const query = "SELECT * FROM courses"

	db.query(query, (err, results) => {
		if (err) {
			res.status(500).json({ error: "Failed to fetch courses" })
		} else {
			res.status(200).json(results)
		}
	})
})

app.post("/api/courseAdd", (req, res) => {
	const { email, code, title } = req.body

	if (!email || !code || !title) {
		return res.status(400).json({ message: "All field are required!" })
	}

	const query = "INSERT INTO courses (email, code, title) VALUES (?, ?, ?)"
	db.query(query, [email, code, title], (err, result) => {
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

app.delete("/api/courseDelete", (req, res) => {
	const { id } = req.body

	if (!id) {
		return res.status(400).json({ message: "ID is required!" })
	}

	const query = "DELETE from courses where id=?"
	db.query(query, [id], (err, result) => {
		console.log(result)
		if (err) {
			console.error("Database error:", err)
			return res.status(500).json({ message: "Internal server error" })
		}

		if (result?.affectedRows > 0) {
			// Successful login
			res.status(200).json({ message: "Delete successfully!" })
		} else {
			res.status(404).json({ message: "Something wrong. Please try again." })
		}
	})
})

app.get("/api/teacherWiseCourses", (req, res) => {
	const { email } = req.query
	const query = "SELECT * FROM courses where email=?"

	db.query(query, [email], (err, results) => {
		if (err) {
			res.status(500).json({ error: "Failed to fetch courses" })
		} else {
			res.status(200).json(results)
		}
	})
})

// Schedule route
app.post("/api/scheduleAdd", (req, res) => {
	const { code, classDetails } = req.body

	if (!code || !classDetails) {
		return res.status(400).json({ message: "All field are required!" })
	}

	const deletequery = "DELETE from schedule where code=?"
	db.query(deletequery, [code], (err, result) => {
		if (err) {
			console.error("Database error:", err)
			return res.status(500).json({ message: "Internal server error" })
		}
	})

	const query = "INSERT INTO schedule ( code, classDetails) VALUES (?, ?)"
	db.query(query, [code, classDetails], (err, result) => {
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

app.get("/api/codeWiseSchedule", (req, res) => {
	const { code } = req.query
	const query = "SELECT * FROM schedule where code=?"

	db.query(query, [code], (err, results) => {
		if (err) {
			res.status(500).json({ error: "Failed to fetch data" })
		} else {
			res.status(200).json(results)
		}
	})
})

//attendance route
app.get("/api/attendance", (req, res) => {
	const { course_code } = req.query
	const query = "SELECT a.*, b.* FROM attendance a INNER JOIN students b ON a.student_email=b.email WHERE a.course_code=?"

	db.query(query, [course_code], (err, results) => {
		if (err) {
			res.status(500).json({ error: "Failed to fetch" })
		} else {
			res.status(200).json(results)
		}
	})
})

// Mobile apps related api
app.post("/api/studentAdd", (req, res) => {
	// console.log(req)
	const { name, userRoll, email, password, androidId } = req.body

	const query = "INSERT INTO students ( name, userRoll, email, password, androidId) VALUES (?, ?, ?, ?, ?)"
	db.query(query, [name, userRoll, email, password, androidId], (err, result) => {
		console.log("result", result)
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

app.post("/api/studentLogin", (req, res) => {
	const { email, password, androidId } = req.body

	const query = "SELECT * FROM students WHERE email = ? AND password = ? AND androidId = ?"
	db.query(query, [email, password, androidId], (err, result) => {
		if (err) {
			console.error("Database error:", err)
			return res.status(500).json({ message: "Internal server error" })
		}

		if (result.length > 0) {
			// Successful login
			res.status(200).json({ message: "Login successful!", user: result[0] })
		} else {
			// User not found
			res.status(404).json({ message: "User does not exist in the database. You must need to login with registed device." })
		}
	})
})

app.get("/api/allCourses", (req, res) => {
	const { code } = req.query
	const query = "SELECT * FROM courses"

	db.query(query, (err, results) => {
		if (err) {
			res.status(500).json({ error: "Failed to fetch data" })
		} else {
			res.status(200).json(results)
		}
	})
})

app.post("/api/addCourseByStudent", (req, res) => {
	const { courses, id } = req.body

	const query = "UPDATE students SET courses=? WHERE id = ?"
	db.query(query, [courses, id], (err, result) => {
		console.log(result)
		if (err) {
			console.error("Database error:", err)
			return res.status(500).json({ message: "Internal server error" })
		}

		if (result.affectedRows > 0) {
			// Successful login
			res.status(200).json({ message: "Successful!", user: result[0] })
		} else {
			// User not found
			res.status(404).json({ message: "Something wrong." })
		}
	})
})

app.post("/api/attendanceSubmit", (req, res) => {
	// console.log(req)
	const { student_email, course_code, present_status, datetime } = req.body

	const query = "INSERT INTO attendance ( student_email, course_code, present_status, datetime) VALUES (?, ?, ?, ?)"
	db.query(query, [student_email, course_code, present_status, datetime], (err, result) => {
		console.log("result", result)
		if (err) {
			console.error("Database error:", err)
			return res.status(500).json({ message: "Internal server error" })
		}

		if (result?.insertId > 0) {
			// Successful login
			res.status(200).json({ message: "Successfull!" })
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
