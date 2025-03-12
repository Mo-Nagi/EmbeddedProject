require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// ✅ إعداد الاتصال بقاعدة البيانات MySQL باستخدام المتغيرات البيئية
const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT || 3306
});

// ✅ التأكد من الاتصال بقاعدة البيانات
db.connect(err => {
    if (err) {
        console.error("❌ MySQL Connection Failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL Database");
});

// ✅ إنشاء جدول لو مش موجود
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        distance FLOAT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;
db.query(createTableQuery, (err) => {
    if (err) console.error("❌ Error creating table:", err);
});

// ✅ API لاستقبال البيانات من SIM800L وحفظها في MySQL
app.post("/send-data", (req, res) => {
    const { distance } = req.body;
    if (distance !== undefined) {
        db.query("INSERT INTO logs (distance) VALUES (?)", [distance], (err) => {
            if (err) {
                console.error("❌ Error inserting data:", err);
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

// ✅ API لجلب آخر قراءة فقط
app.get("/get-data", (req, res) => {
    db.query("SELECT * FROM logs ORDER BY timestamp DESC LIMIT 1", (err, results) => {
        if (err) {
            console.error("❌ Error fetching data:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(results.length ? results[0] : { distance: 0 });
        }
    });
});

// ✅ API لجلب جميع القراءات السابقة (Logs)
app.get("/logs", (req, res) => {
    db.query("SELECT * FROM logs ORDER BY timestamp DESC", (err, results) => {
        if (err) {
            console.error("❌ Error fetching logs:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(results);
        }
    });
});

// ✅ Route لاختبار الاتصال بقاعدة البيانات يدويًا
app.get("/test-db", (req, res) => {
    db.query("SHOW DATABASES;", (err, results) => {
        if (err) {
            console.error("❌ Database connection failed!", err);
            res.status(500).json({ error: "Database connection failed!", details: err });
        } else {
            res.json({ message: "Database connected successfully!", databases: results });
        }
    });
});

// ✅ توجيه أي طلب غير معروف إلى index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ تشغيل السيرفر على 0.0.0.0 لحل مشاكل الوصول في Railway
app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running at http://0.0.0.0:${port}`);
});
