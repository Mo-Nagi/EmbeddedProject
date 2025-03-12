const apiUrl = "https://embeddedproject-production.up.railway.app/get-data";

async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        document.getElementById("data").textContent = data.distance;
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("data").textContent = "Error!";
    }
}

// تحديث البيانات كل ثانية
setInterval(fetchData, 1000);
fetchData();
