const express = require("express");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));


const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQLDATABASE,
});

db.connect(err => {
    if (err) {
        console.error(" MySQL Connection Failed:", err);
        return;
    }
    console.log(" Connected to MySQL Database");
});


db.query(`
    CREATE TABLE IF NOT EXISTS logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        distance FLOAT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) console.error(" Error creating table:", err);
});


app.post("/send-data", (req, res) => {
    const { distance } = req.body;
    if (distance !== undefined) {
        db.query("INSERT INTO logs (distance) VALUES (?)", [distance], (err) => {
            if (err) {
                console.error(" Error inserting data:", err);
                res.status(500).json({ error: "Database error" });
            } else {
                console.log(`📡 Data received: ${distance} cm`);
                res.json({ message: "Data saved successfully!" });
            }
        });
    } else {
        res.status(400).json({ error: "Invalid data!" });
    }
});


app.get("/get-data", (req, res) => {
    db.query("SELECT * FROM logs ORDER BY timestamp DESC LIMIT 1", (err, results) => {
        if (err) {
            console.error(" Error fetching data:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(results.length ? results[0] : { distance: 0 });
        }
    });
});


app.get("/logs", (req, res) => {
    db.query("SELECT * FROM logs ORDER BY timestamp DESC", (err, results) => {
        if (err) {
            console.error(" Error fetching logs:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(results);
        }
    });
});


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


app.listen(port, () => {
    console.log(` Server running at http://localhost:${port}`);
});
