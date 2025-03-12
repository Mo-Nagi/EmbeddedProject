
const apiUrl = "https://embeddedproject-production.up.railway.app";

// ✅ جلب آخر قراءة من كل سينسور
async function fetchData() {
    try {
        const response = await fetch(`${apiUrl}/get-data`);
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        const data = await response.json();
        
        document.getElementById("data1").textContent = data.sensor1;
        document.getElementById("data2").textContent = data.sensor2;
        document.getElementById("average").textContent = ((data.sensor1 + data.sensor2) / 2).toFixed(2);
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        document.getElementById("data1").textContent = "Error!";
        document.getElementById("data2").textContent = "Error!";
        document.getElementById("average").textContent = "Error!";
    }
}

// ✅ جلب جميع الـ Logs
async function fetchLogs() {
    try {
        const response = await fetch(`${apiUrl}/logs`);
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        const logs = await response.json();
        const logsList = document.getElementById("logsList");
        logsList.innerHTML = logs.map(log => `<li>${log.timestamp}: Sensor 1: ${log.sensor1} cm | Sensor 2: ${log.sensor2} cm</li>`).join("");
    } catch (error) {
        console.error("❌ Error fetching logs:", error);
    }
}

// ✅ التحكم في فتح/إغلاق نافذة الـ Popup
const logsPopup = document.getElementById("logsPopup");
const showLogsBtn = document.getElementById("showLogs");
const closeLogsBtn = document.getElementById("closeLogs");

showLogsBtn.addEventListener("click", () => {
    logsPopup.style.display = "block";
    fetchLogs();
});

closeLogsBtn.addEventListener("click", () => {
    logsPopup.style.display = "none";
});

// ✅ إغلاق النافذة عند الضغط خارجها
document.addEventListener("click", (event) => {
    if (event.target === logsPopup) {
        logsPopup.style.display = "none";
    }
});

// ✅ تحديث البيانات كل ثانية
setInterval(fetchData, 1000);
fetchData();
