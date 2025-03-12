require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT ;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

db.connect(err => {
    if (err) {
        console.error(" MySQL Connection Failed:");
        console.error("Error Code:", err.code);
        console.error("Error No:", err.errno);
        console.error("SQL State:", err.sqlState);
        console.error("Message:", err.sqlMessage);
        return;
    }
    console.log(" Connected to MySQL Database");
});

app.get("/test-db", (req, res) => {
    db.query("SHOW DATABASES;", (err, results) => {
        if (err) {
            res.status(500).json({ error: "Database connection failed!", details: err });
        } else {
            res.json({ message: "Database connected successfully!", databases: results });
        }
    });
});

app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running at http://0.0.0.0:${port}`);
});
