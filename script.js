

const apiUrl = "https://embeddedproject-production.up.railway.app";

// ✅ جلب آخر قراءة
async function fetchData() {
    try {
        const response = await fetch(`${apiUrl}/get-data`);
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        const data = await response.json();
        document.getElementById("data").textContent = data.distance;
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        document.getElementById("data").textContent = "Error!";
    }
}

// ✅ جلب جميع الـ Logs
async function fetchLogs() {
    try {
        const response = await fetch(`${apiUrl}/logs`);
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        const logs = await response.json();
        const logsList = document.getElementById("logsList");
        logsList.innerHTML = logs.map(log => `<li>${log.timestamp}: ${log.distance} cm</li>`).join("");
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
