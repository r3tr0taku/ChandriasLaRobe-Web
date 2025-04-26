document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body"),
        sidebar = body.querySelector(".sidebar"),
        toggle = body.querySelector(".toggle"),
        modeSwitch = body.querySelector(".toggle-switch"),
        modeText = body.querySelector(".mode-text");

    // Sidebar toggle (chevron)
    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
    });

    // Mode toggle
    modeSwitch.addEventListener("click", () => {
        body.classList.toggle("dark");
        modeText.innerText = body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
    });
});

const appointments = [
    {
        id: 101,
        customer: "John Doe",
        contact: "john@example.com",
        appointment: "2025-04-28 2:00 PM",
        status: "Upcoming",
        productId: "P-001" // 🔥 now productId instead of rental
    },
    {
        id: 102,
        customer: "Jane Smith",
        contact: "jane@example.com",
        appointment: "2025-04-26 4:00 PM",
        status: "Completed",
        productId: "P-002"
    },
    {
        id: 103,
        customer: "Michael Johnson",
        contact: "michael@example.com",
        appointment: "2025-04-29 1:00 PM",
        status: "Cancelled",
        productId: "P-003"
    }
];

const tbody = document.getElementById("appointment-body");

function renderAppointments(data) {
    tbody.innerHTML = "";
    data.forEach(app => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>#${app.id}</td>
            <td>${app.customer}</td>
            <td>${app.contact}</td>
            <td>${app.appointment}</td>
            <td class="status-${app.status.toLowerCase()}">${app.status}</td>
            <td>${app.productId}</td> <!-- Updated here -->
            <td><button onclick="viewDetails(${app.id})">View</button></td>
        `;

        tbody.appendChild(tr);
    });
}

function viewDetails(id) {
    alert("Viewing details for Appointment ID: " + id);
}

renderAppointments(appointments);

// Search functionality
document.getElementById("search").addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = appointments.filter(app => app.customer.toLowerCase().includes(keyword));
    renderAppointments(filtered);
});