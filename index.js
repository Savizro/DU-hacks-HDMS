const users = [
    { email: 'hospital@example.com', password: 'password', role: 'hospital_staff', hospitalId: 1 },
    { email: 'department@example.com', password: 'password', role: 'department_manager', hospitalId: 1 },
    { email: 'admin@example.com', password: 'password', role: 'super_admin' }
];


const hospitals = [
    { id: 1, name: 'City General Hospital', departments: ['Cardiology', 'Orthopedics', 'Pediatrics'] },
    { id: 2, name: 'County Medical Center', departments: ['Neurology', 'Oncology', 'Emergency'] }
];


let patientData = [
    { id: 1, hospitalId: 1, department: 'Cardiology', patientCount: 10, bedOccupancy: 50, date: '2025-02-23' },
];

let currentUser = null;

const navMenu = document.getElementById('nav-menu');
const mainContent = document.getElementById('main-content');


function showRoleSelection() {
    mainContent.innerHTML = `
        <h2>Select Your Role</h2>
        <div class="role-selection">
            <button onclick="showLoginForm('hospital_staff')">Hospital Staff</button>
            <button onclick="showLoginForm('department_manager')">Department Manager</button>
            <button onclick="showLoginForm('super_admin')">Super Admin</button>
        </div>
    `;
}


function showLoginForm(role) {
    mainContent.innerHTML = `
        <h2>Login (${role.replace('_', ' ')})</h2>
        <form id="login-form">
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    `;

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password, role);
    });
}


function login(email, password, role) {
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    if (user) {
        currentUser = user;
        updateNavMenu();
        showDashboard();
    } else {
        alert('Invalid email or password');
    }
}


function logout() {
    currentUser = null;
    updateNavMenu();
    showRoleSelection();
}


function updateNavMenu() {
    if (currentUser) {
        navMenu.innerHTML = `
            <button onclick="showDashboard()">Dashboard</button>
            <button onclick="logout()">Logout</button>
        `;
    } else {
        navMenu.innerHTML = <button onclick="showRoleSelection()">Login</button>;
    }
}


function showDashboard() {
    if (!currentUser) {
        showRoleSelection();
        return;
    }

    switch (currentUser.role) {
        case 'hospital_staff':
            showHospitalSelection();
            break;
        case 'department_manager':
            showDepartmentManagerDashboard();
            break;
        case 'super_admin':
            showSuperAdminDashboard();
            break;
    }
}


function showHospitalSelection() {
    mainContent.innerHTML = `
        <h2>Select Your Hospital</h2>
        <div class="hospital-selection">
            ${hospitals.map(hospital => `
                <button onclick="showDepartmentSelection(${hospital.id})">${hospital.name}</button>
            `).join('')}
        </div>
    `;
}


function showDepartmentSelection(hospitalId) {
    const hospital = hospitals.find(h => h.id === hospitalId);
    mainContent.innerHTML = `
        <h2>Select Your Department</h2>
        <div class="department-selection">
            ${hospital.departments.map(dept => `
                <button onclick="showPatientDataForm(${hospitalId}, '${dept}')">${dept}</button>
            `).join('')}
        </div>
    `;
}


function showPatientDataForm(hospitalId, department) {
    mainContent.innerHTML = `
        <h2>Add Patient Data (${department})</h2>
        <form id="patient-data-form">
            <input type="number" id="patient-count" placeholder="Patient Count" required>
            <input type="number" id="bed-occupancy" placeholder="Bed Occupancy (%)" required>
            <button type="submit">Submit Data</button>
        </form>
    `;

    document.getElementById('patient-data-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const patientCount = document.getElementById('patient-count').value;
        const bedOccupancy = document.getElementById('bed-occupancy').value;
        addPatientData(hospitalId, department, patientCount, bedOccupancy);
    });
}


function addPatientData(hospitalId, department, patientCount, bedOccupancy) {
    const newData = {
        id: patientData.length + 1,
        hospitalId: hospitalId,
        department: department,
        patientCount: parseInt(patientCount),
        bedOccupancy: parseInt(bedOccupancy),
        date: new Date().toISOString().split('T')[0]
    };
    patientData.push(newData);
    alert('Data submitted successfully');
    showDashboard();
}


function showDepartmentManagerDashboard() {
    const hospitalId = currentUser.hospitalId;
    const hospital = hospitals.find(h => h.id === hospitalId);
    const filteredData = patientData.filter(data => data.hospitalId === hospitalId);

    mainContent.innerHTML = `
        <h2>Department Manager Dashboard (${hospital.name})</h2>
        <table>
            <thead>
                <tr>
                    <th>Department</th>
                    <th>Patient Count</th>
                    <th>Bed Occupancy (%)</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody id="hospital-data">
            </tbody>
        </table>
    `;

    const tableBody = document.getElementById('hospital-data');
    tableBody.innerHTML = filteredData.map(data => `
        <tr>
            <td>${data.department}</td>
            <td>${data.patientCount}</td>
            <td>${data.bedOccupancy}</td>
            <td>${data.date}</td>
        </tr>
    `).join('');
}


function showSuperAdminDashboard() {
    mainContent.innerHTML = `
        <h2>Super Admin Dashboard</h2>
        <button onclick="addPatientDataSuperAdmin()">Add New Data</button>
        <table>
            <thead>
                <tr>
                    <th>Hospital</th>
                    <th>Department</th>
                    <th>Patient Count</th>
                    <th>Bed Occupancy (%)</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="hospital-data">
            </tbody>
        </table>
    `;
    updateSuperAdminTable();
}


function updateSuperAdminTable() {
    const tableBody = document.getElementById('hospital-data');
    tableBody.innerHTML = patientData.map((data, index) => {
        const hospital = hospitals.find(h => h.id === data.hospitalId);
        return `
            <tr>
                <td>${hospital ? hospital.name : 'Unknown'}</td>
                <td>${data.department}</td>
                <td>${data.patientCount}</td>
                <td>${data.bedOccupancy}</td>
                <td>${data.date}</td>
                <td>
                    <button onclick="editPatientData(${index})">Edit</button>
                    <button onclick="deletePatientData(${index})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}


function addPatientDataSuperAdmin() {
    const hospitalId = prompt("Enter Hospital ID:");
    const department = prompt("Enter Department:");
    const patientCount = prompt("Enter Patient Count:");
    const bedOccupancy = prompt("Enter Bed Occupancy (%):");
    if (hospitalId && department && patientCount && bedOccupancy) {
        addPatientData(parseInt(hospitalId), department, patientCount, bedOccupancy);
        updateSuperAdminTable();
    }
}


function editPatientData(index) {
    const patientCount = prompt("Edit Patient Count:", patientData[index].patientCount);
    const bedOccupancy = prompt("Edit Bed Occupancy (%):", patientData[index].bedOccupancy);
    if (patientCount && bedOccupancy) {
        patientData[index].patientCount = parseInt(patientCount);
        patientData[index].bedOccupancy = parseInt(bedOccupancy);
        updateSuperAdminTable();
    }
}


function deletePatientData(index) {
    if (confirm("Are you sure you want to delete this record?")) {
        patientData.splice(index, 1);
        updateSuperAdminTable();
    }
}


updateNavMenu();
showRoleSelection();
