const apiUrl = "https://embeddedproject-production.up.railway.app";

document.addEventListener("DOMContentLoaded", () => {
    const logsPopup = document.getElementById("logsPopup");
    const showLogsBtn = document.getElementById("showLogs");
    const closeLogsBtn = document.getElementById("closeLogs");

    async function fetchData() {
        try {
            const response = await fetch(`${apiUrl}/get-data`);
            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
            const data = await response.json();
            
            console.log("📡 Data received:", data);
            
            document.getElementById("data1").textContent = data.sensor1 ?? "N/A";
            document.getElementById("data2").textContent = data.sensor2 ?? "N/A";
            document.getElementById("average").textContent = data.average ?? "N/A";
        } catch (error) {
            console.error("❌ Error fetching data:", error);
            document.getElementById("data1").textContent = "Error!";
            document.getElementById("data2").textContent = "Error!";
            document.getElementById("average").textContent = "Error!";
        }
    }

    async function fetchLogs() {
        try {
            const response = await fetch(`${apiUrl}/logs`);
            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
            const logs = await response.json();
            const logsList = document.getElementById("logsList");
            logsList.innerHTML = logs.map(log => 
                `<li>${log.timestamp}: Sensor 1: ${log.sensor1} cm | Sensor 2: ${log.sensor2} cm | Average: ${log.average} cm</li>`).join("");
        } catch (error) {
            console.error("❌ Error fetching logs:", error);
        }
    }

    if (showLogsBtn && logsPopup && closeLogsBtn) {
        showLogsBtn.addEventListener("click", () => {
            logsPopup.style.display = "flex";
            fetchLogs();
        });

        closeLogsBtn.addEventListener("click", () => {
            logsPopup.style.display = "none";
        });

        logsPopup.addEventListener("click", (event) => {
            if (event.target === logsPopup) {
                logsPopup.style.display = "none";
            }
        });
    } else {
        console.error("❌ One or more elements (logsPopup, showLogsBtn, closeLogsBtn) not found!");
    }

    setInterval(fetchData, 1000);
    fetchData();
});
