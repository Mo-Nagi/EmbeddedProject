require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
const fs = require("fs");
const { Parser } = require("json2csv");
const path = require("path");
const xlsx = require("xlsx");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const db = mysql.createPool({
    host: process.env.MYSQLHOST || "mysql.railway.internal",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "OflMbcDBHDpzxeBepIstEZGFYBYFElKD",
    database: process.env.MYSQLDATABASE || "railway",
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sensor1 FLOAT NOT NULL,
        sensor2 FLOAT NOT NULL,
        average FLOAT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;
db.query(createTableQuery, err => {
    if (err) console.error("❌ Error creating table:", err);
    else console.log("✅ Table 'logs' is ready!");
});

app.get("/send-data", (req, res) => {
    const { sensor1, sensor2 } = req.query;

    if (sensor1 !== undefined && sensor2 !== undefined) {
        const average = ((parseFloat(sensor1) + parseFloat(sensor2)) / 2).toFixed(2);

        db.query(
            "INSERT INTO logs (sensor1, sensor2, average) VALUES (?, ?, ?)",
            [sensor1, sensor2, average],
            err => {
                if (err) {
                    console.error("❌ Error inserting data:", err);
                    return res.status(500).json({ error: "Database error" });
                }
                console.log(`📡 Data received: Sensor1=${sensor1} cm, Sensor2=${sensor2} cm, Average=${average} cm`);
                res.json({ message: "Data saved successfully!" });
            }
        );
    } else {
        res.status(400).json({ error: "Invalid data!" });
    }
});

app.get("/get-data", (req, res) => {
    db.query(
        "SELECT sensor1, sensor2, average, timestamp FROM logs ORDER BY timestamp DESC LIMIT 1",
        (err, results) => {
            if (err) {
                console.error("❌ Error fetching data:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json(results.length ? results[0] : { sensor1: 0, sensor2: 0, average: 0, timestamp: "N/A" });
        }
    );
});

app.get("/logs", (req, res) => {
    db.query(
        "SELECT sensor1, sensor2, average, DATE_FORMAT(timestamp, '%b %d %h:%i:%s %p') AS timestamp FROM logs ORDER BY timestamp DESC",
        (err, results) => {
            if (err) {
                console.error("❌ Error fetching logs:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json(results);
        }
    );
});

app.get('/export/excel', (req, res) => {
    db.query(
        "SELECT sensor1, sensor2, average, timestamp FROM logs ORDER BY timestamp DESC",
        (err, results) => {
            if (err) {
                console.error('❌ Error fetching data from database:', err);
                return res.status(500).send('Error fetching data');
            }

            const ws = xlsx.utils.json_to_sheet(results);
            const wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'Sensor Data');
            const filePath = path.join(__dirname, 'sensor_data.xlsx');
            xlsx.writeFile(wb, filePath);
            res.download(filePath, 'sensor_data.xlsx', (err) => {
                if (err) {
                    console.error('Error downloading the file:', err);
                    res.status(500).send('Error downloading the file');
                }
                fs.unlinkSync(filePath);
            });
        }
    );
});


app.get("/search", (req, res) => {
    const { startDate, endDate, minDepth, maxDepth } = req.query;
    let query = "SELECT * FROM logs WHERE 1=1";
    const params = [];

    if (startDate) {
        query += " AND timestamp >= ?";
        params.push(startDate);
    }
    if (endDate) {
        query += " AND timestamp <= ?";
        params.push(endDate);
    }
    if (minDepth) {
        query += " AND average >= ?";
        params.push(minDepth);
    }
    if (maxDepth) {
        query += " AND average <= ?";
        params.push(maxDepth);
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

app.get("/compare", (req, res) => {
    const { date1, date2 } = req.query;

    if (!date1 || !date2) {
        return res.status(400).json({ error: "Missing dates for comparison" });
    }

    db.query("SELECT * FROM logs WHERE DATE(timestamp) IN (?, ?)", [date1, date2], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

setInterval(() => {
    console.log("🔄 Keeping server alive...");
}, 18000000);

app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running at http://0.0.0.0:${port}`);
});


