const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// ✅ Array لتخزين البيانات بدل قاعدة البيانات
let logs = [];

// ✅ استقبال البيانات من SIM800L وتخزينها في الذاكرة
app.post("/send-data", (req, res) => {
    const { distance } = req.body;
    if (distance !== undefined) {
        logs.push({ distance, timestamp: new Date().toISOString() });
        console.log(`📡 Data received: ${distance} cm`);
        res.json({ message: "Data saved successfully!" });
    } else {
        res.status(400).json({ error: "Invalid data!" });
    }
});

// ✅ API لجلب آخر قراءة فقط
app.get("/get-data", (req, res) => {
    if (logs.length > 0) {
        res.json(logs[logs.length - 1]);
    } else {
        res.json({ distance: 0 });
    }
});

// ✅ API لجلب جميع القراءات السابقة (Logs)
app.get("/logs", (req, res) => {
    res.json(logs);
});

// ✅ توجيه أي طلب غير معروف إلى index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ تشغيل السيرفر
app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running at http://0.0.0.0:${port}`);
});
