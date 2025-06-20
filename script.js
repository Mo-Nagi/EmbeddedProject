const apiUrl = "https://embeddedsysproject-production.up.railway.app/";

let depthChart;
const ctx = document.getElementById("depthChart").getContext("2d");
document.addEventListener("DOMContentLoaded", () => {
    const popupContent = document.getElementById("logsContainer");
    console.log("popupContent:", popupContent); 
});


const downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", function() {
    window.location.href = `${apiUrl}/export/excel`; 
});





document.addEventListener("DOMContentLoaded", () => {
    const logsContainer = document.getElementById("logsContainer");
    const showLogsBtn = document.getElementById("showLogs");
    const closeLogsBtn = document.getElementById("closeLogs");
    const downloadCsvBtn = document.getElementById("downloadCsv");
    const downloadExcelBtn = document.getElementById("downloadExcel");
    const downloadJsonBtn = document.getElementById("downloadJson");
    const dateFilter = document.getElementById("dateFilter");
    const compareBtn = document.getElementById("compareBtn");
    const searchExtremeBtn = document.getElementById("searchExtremeBtn");

if (searchExtremeBtn) {
    searchExtremeBtn.addEventListener("click", async () => {
        try {
            const response = await fetch(`${apiUrl}/extreme-values`);
            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

            const extremeValues = await response.json();
            console.log("Extreme Values:", extremeValues);

            document.getElementById("maxValue").innerHTML = `${extremeValues.max_value} <span style="color: white;">cm at </span>${extremeValues.max_timestamp}</span>`;
            document.getElementById("minValue").innerHTML = `${extremeValues.min_value} <span style="color: white;">cm at </span>${extremeValues.min_timestamp}</span>`;
        } catch (error) {
            console.error("❌ Error fetching extreme values:", error);
        }
    });
}

    document.addEventListener("DOMContentLoaded", () => {
        const popupContent = document.getElementById("logsContainer"); 
        const showLogsBtn = document.getElementById("showLogs");
        const closeLogsBtn = document.getElementById("closeLogs");
    
        if (!popupContent) {
            console.error("❌ Element #logsContainer not found!");
            return;
        }
    
        if (!showLogsBtn) {
            console.error("❌ Element #showLogs not found!");
            return;
        }
    
        if (!closeLogsBtn) {
            console.error("❌ Element #closeLogs not found!");
            return;
        }
    
        showLogsBtn.addEventListener("click", () => {
            popupContent.style.display = "flex";
            fetchLogs();
        });
    
        closeLogsBtn.addEventListener("click", () => {
            popupContent.style.display = "none";
        });
    });
    
    showLogsBtn.addEventListener("click", () => {
        logsContainer.style.display = "flex";
        fetchLogs();
    
        setTimeout(() => {
            let maxWidth = 0;
            logsList.querySelectorAll("li").forEach(item => {
                const tempSpan = document.createElement("span");
                tempSpan.style.visibility = "hidden";
                tempSpan.style.position = "absolute";
                tempSpan.style.whiteSpace = "nowrap";
                tempSpan.textContent = item.textContent;
                document.body.appendChild(tempSpan);
                maxWidth = Math.max(maxWidth, tempSpan.offsetWidth);
                document.body.removeChild(tempSpan);
            });
    
            logsContainer.style.width = `${maxWidth + 40}px`;
        }, 100);
    });
    
    
    
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
    
            if (!logsList) {
                console.error("❌ logsList element not found!");
                return;
            }
    
            logsList.innerHTML = logs.map(log => 
                `<li>${log.timestamp}: Sensor 1: ${log.sensor1} cm | Sensor 2: ${log.sensor2} cm | Average: ${log.average} cm</li>`
            ).join("");
        } catch (error) {
            console.error("❌ Error fetching logs:", error);
        }
    }
    

    if (showLogsBtn && logsContainer && closeLogsBtn) {
        showLogsBtn.addEventListener("click", () => {
            logsContainer.style.display = "block";
            fetchLogs();
        });
    
        closeLogsBtn.addEventListener("click", () => {
            logsContainer.style.display = "none";
        });
    } else {
        console.error("❌ One or more elements (logsContainer, showLogsBtn, closeLogsBtn) not found!");
    }
    

    if (downloadCsvBtn) {
        downloadCsvBtn.addEventListener("click", () => {
            window.location.href = `${apiUrl}/export/csv`;
        });
    }

    if (downloadExcelBtn) {
        downloadExcelBtn.addEventListener("click", () => {
            window.location.href = `${apiUrl}/export/excel`;
        });
    }

    if (downloadJsonBtn) {
        downloadJsonBtn.addEventListener("click", () => {
            window.location.href = `${apiUrl}/export/json`;
        });
    }

    if (dateFilter) {
        dateFilter.addEventListener("change", async () => {
            const selectedDate = dateFilter.value;
            try {
                const response = await fetch(`${apiUrl}/filter?startDate=${selectedDate}`);
                if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
                const filteredData = await response.json();
                console.log("Filtered Data:", filteredData);
            } catch (error) {
                console.error("❌ Error fetching filtered data:", error);
            }
        });
    }

    if (compareBtn) {
        compareBtn.addEventListener("click", async () => {
            const period1Start = document.getElementById("period1Start").value;
            const period1End = document.getElementById("period1End").value;
            const period2Start = document.getElementById("period2Start").value;
            const period2End = document.getElementById("period2End").value;
            
            try {
                const response = await fetch(`${apiUrl}/compare?period1Start=${period1Start}&period1End=${period1End}&period2Start=${period2Start}&period2End=${period2End}`);
                if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
                const comparisonData = await response.json();
                console.log("Comparison Data:", comparisonData);
            } catch (error) {
                console.error("❌ Error fetching comparison data:", error);
            }
        });
    }

    setInterval(fetchData, 1000);
    fetchData();
});

async function fetchChartData() {
    try {
        const response = await fetch(`${apiUrl}/logs`);
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        const data = await response.json();

        console.log("📊 Raw Data:", data);

        if (!Array.isArray(data) || data.length === 0) {
            console.warn("⚠️ No data available for the chart!");
            return;
        }

        const formattedLabels = data.map(entry => {
            const date = new Date(entry.timestamp);
            return date.toLocaleString("en-GB", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
        });

        const sensor1Data = data.map(entry => entry.sensor1);
        const sensor2Data = data.map(entry => entry.sensor2);
        const averageData = data.map(entry => entry.average);

        updateChart(formattedLabels, sensor1Data, sensor2Data, averageData);
    } catch (error) {
        console.error("❌ Error fetching chart data:", error);
    }
}


function updateChart(labels, sensor1, sensor2, average) {
    if (typeof depthChart !== "undefined" && depthChart !== null) {
        depthChart.destroy();
    }
    
    depthChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                { label: "Sensor 1", data: sensor1, borderColor: "red", fill: false },
                { label: "Sensor 2", data: sensor2, borderColor: "blue", fill: false },
                { label: "Average Depth", data: average, borderColor: "green", fill: false }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Time" } },
                y: { title: { display: true, text: "Depth (cm)" } }
            }
        }
    });
}

fetchChartData();
setInterval(fetchChartData, 5000);
