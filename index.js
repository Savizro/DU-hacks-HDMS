document.addEventListener("DOMContentLoaded", () => {
    const loginSection = document.getElementById("loginSection");
    const dashboard = document.getElementById("dashboard");
    const loginForm = document.getElementById("loginForm");
    const dataEntryForm = document.getElementById("dataEntryForm");
    const dataTableBody = document.getElementById("dataTableBody");
    const ctx = document.getElementById("dataChart").getContext("2d");
    const toggleThemeButton = document.getElementById("toggleTheme");
    
    let hospitalData = [];
    let chart;
    
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        loginSection.style.display = "none";
        dashboard.style.display = "block";
    });
    
    dataEntryForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const date = document.getElementById("dateInput").value;
        const patientCount = parseInt(document.getElementById("patientCount").value);
        const bedOccupancy = parseInt(document.getElementById("bedOccupancy").value);
        
        if (isNaN(patientCount) || isNaN(bedOccupancy)) {
            alert("Please enter valid numbers for Patient Count and Bed Occupancy.");
            return;
        }

        const newData = { date, patientCount, bedOccupancy };
        hospitalData.push(newData);
        renderTable();
        updateChart();
    });
    
    function renderTable() {
        dataTableBody.innerHTML = "";
        hospitalData.forEach(data => {
            const row = `<tr>
                <td>${data.date}</td>
                <td>${data.patientCount}</td>
                <td>${data.bedOccupancy}</td>
            </tr>`;
            dataTableBody.innerHTML += row;
        });
    }
    
    function updateChart() {
        if (chart) chart.destroy();
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hospitalData.map(d => d.date),
                datasets: [{
                    label: 'Patient Count',
                    data: hospitalData.map(d => d.patientCount),
                    borderColor: 'blue',
                    fill: false
                }, {
                    label: 'Bed Occupancy (%)',
                    data: hospitalData.map(d => d.bedOccupancy),
                    borderColor: 'red',
                    fill: false
                }]
            }
        });
    }

    toggleThemeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        toggleThemeButton.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    });
});
