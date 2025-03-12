const apiUrl = window.location.origin;

async function fetchData() {
    try {
        const response = await fetch(`${apiUrl}/get-data`);
        const data = await response.json();
        document.getElementById("data").textContent = data.distance;
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("data").textContent = "Error!";
    }
}


async function fetchLogs() {
    try {
        const response = await fetch(`${apiUrl}/logs`);
        const logs = await response.json();
        const logsList = document.getElementById("logsList");
        logsList.innerHTML = logs.map(log => `<li>${log.timestamp}: ${log.distance} cm</li>`).join("");
    } catch (error) {
        console.error("Error fetching logs:", error);
    }
}


document.getElementById("showLogs").addEventListener("click", () => {
    document.getElementById("logsPanel").classList.add("open");
    fetchLogs();
});

document.getElementById("closeLogs").addEventListener("click", () => {
    document.getElementById("logsPanel").classList.remove("open");
});

setInterval(fetchData, 1000);
fetchData();
