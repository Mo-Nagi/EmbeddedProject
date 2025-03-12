const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// 📌 متغير لتخزين بيانات المستشعر
let sensorData = { distance: 0 };

// ✅ API لاستقبال البيانات من SIM800L
app.post("/send-data", (req, res) => {
    const { distance } = req.body;
    if (distance !== undefined) {
        sensorData.distance = distance;
        console.log("Received Data:", sensorData);
        res.json({ message: "Data received successfully!", data: sensorData });
    } else {
        res.status(400).json({ error: "Invalid data!" });
    }
});

// ✅ API لجلب البيانات لعرضها في الفرونت إند
app.get("/get-data", (req, res) => {
    res.json(sensorData);
});

// ✅ جعل Express يخدم الملفات الثابتة (HTML, CSS, JS) من نفس المجلد
app.use(express.static(__dirname));

// ✅ أي طلب غير معروف يرجع `index.html` علشان الفرونت إند يشتغل صح
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ تشغيل السيرفر
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
