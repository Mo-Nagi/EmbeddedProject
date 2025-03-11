const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000; // يستخدم بورت Render تلقائيًا

app.use(express.json());
app.use(cors());

let sensorData = { distance: 0 };

// 📌 نقطة استقبال البيانات من ESP + SIM800L
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

// 📌 نقطة لجلب البيانات وعرضها في الفرونت إند
app.get("/get-data", (req, res) => {
    res.json(sensorData);
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
