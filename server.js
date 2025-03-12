require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// ✅ إعداد الاتصال بقاعدة البيانات MySQL
const db = mysql.createConnection({
    host: process.env.MYSQLHOST || "mysql.railway.internal",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "OflMbcDBHDpzxeBepIstEZGFYBYFElKD",
    database: process.env.MYSQLDATABASE || "railway",
    port: process.env.MYSQLPORT || 3306
});

db.connect(err => {
    if (err) {
        console.error("❌ MySQL Connection Failed:", err);
    } else {
        console.log("✅ Connected to MySQL Database");
    }
});

// ✅ إنشاء جدول لو مش موجود
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sensor1 FLOAT NOT NULL,
        sensor2 FLOAT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;
db.query(createTableQuery, err => {
    if (err) console.error("❌ Error creating table:", err);
    else console.log("✅ Table 'logs' is ready!");
});

// ✅ API لاستقبال بيانات السينسورين وحفظها في MySQL
app.post("/send-data", (req, res) => {
    const { sensor1, sensor2 } = req.body;
    if (sensor1 !== undefined && sensor2 !== undefined) {
        db.query("INSERT INTO logs (sensor1, sensor2) VALUES (?, ?)", [sensor1, sensor2], err => {
            if (err) {
                console.error("❌ Error inserting data:", err);
                res.status(500).json({ error: "Database error" });
            } else {
                console.log(`📡 Data received: Sensor1=${sensor1} cm, Sensor2=${sensor2} cm`);
                res.json({ message: "Data saved successfully!" });
            }
        });
    } else {
        res.status(400).json({ error: "Invalid data!" });
    }
});

// ✅ API لجلب آخر قراءة من كل سينسور وحساب المتوسط
app.get("/get-data", (req, res) => {
    db.query("SELECT sensor1, sensor2, (sensor1 + sensor2) / 2 AS average, DATE_FORMAT(timestamp, '%b %d %h:%i:%s %p') AS timestamp FROM logs ORDER BY timestamp DESC LIMIT 1", (err, results) => {
        if (err) {
            console.error("❌ Error fetching data:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(results.length ? results[0] : { sensor1: 0, sensor2: 0, average: 0, timestamp: "N/A" });
        }
    });
});

// ✅ API لجلب جميع القراءات السابقة (Logs)
app.get("/logs", (req, res) => {
    db.query("SELECT sensor1, sensor2, (sensor1 + sensor2) / 2 AS average, DATE_FORMAT(timestamp, '%b %d %h:%i:%s %p') AS timestamp FROM logs ORDER BY timestamp DESC", (err, results) => {
        if (err) {
            console.error("❌ Error fetching logs:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(results);
        }
    });
});

// ✅ Route لتقديم الصفحة الرئيسية
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


// ✅ تشغيل السيرفر
app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running at http://0.0.0.0:${port}`);
});
