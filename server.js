const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

let sensorData = { distance: 0 };

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

app.get("/get-data", (req, res) => {
    res.json(sensorData);
});

app.use(express.static(__dirname));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
