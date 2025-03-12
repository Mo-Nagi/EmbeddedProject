const apiUrl = "https://embeddedproject-production.up.railway.app";

// ✅ جلب آخر قراءة وعرضها في الصفحة
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

// ✅ جلب جميع الـ Logs وعرضها في النافذة الجانبية
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

// ✅ التحكم في فتح/إغلاق نافذة الـ Logs
document.getElementById("showLogs").addEventListener("click", () => {
    document.getElementById("logsPanel").classList.add("open");
    fetchLogs();
});

document.getElementById("closeLogs").addEventListener("click", () => {
    document.getElementById("logsPanel").classList.remove("open");
});

// ✅ تحديث البيانات كل ثانية
setInterval(fetchData, 1000);
fetchData();
