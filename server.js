require("dotenv").config();
const mysql = require("mysql2");

// ✅ إعداد الاتصال بقاعدة البيانات
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
        process.exit(1);
    }
    console.log("✅ Connected to MySQL Database");

    // ✅ حذف جدول logs
    const dropTableQuery = "DROP TABLE IF EXISTS logs;";
    db.query(dropTableQuery, err => {
        if (err) {
            console.error("❌ Error dropping table:", err);
        } else {
            console.log("✅ Table 'logs' has been dropped successfully!");
        }
        db.end(); // إنهاء الاتصال بعد تنفيذ العملية
    });
});
