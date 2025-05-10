document.addEventListener("DOMContentLoaded", () => {
    // Sidebar toggle logic
    const body = document.querySelector("body"),
        sidebar = body.querySelector(".sidebar"),
        toggle = body.querySelector(".toggle");
    if (toggle && sidebar) {
        if (localStorage.getItem("admin-sidebar-closed") === "true") {
            sidebar.classList.add("close");
        }
        toggle.addEventListener("click", () => {
            const isClosed = sidebar.classList.toggle("close");
            localStorage.setItem("admin-sidebar-closed", isClosed);
        });
    }

    // Rentals data
    const rentals = [
        { name: 'Eimi FUkuda', code: '85631', payment: 'Due', status: 'Pending', details: 'View' },
        { name: 'Maria Nagai', code: '36378', payment: 'Refunded', status: 'Declined', details: 'View' },
        { name: 'Akari Minase', code: '49347', payment: 'Due', status: 'Pending', details: 'View' },
        { name: 'Kururugi Aoi', code: '96996', payment: 'Paid', status: 'Delivered', details: 'View' },
        { name: 'Mori Hinako', code: '22821', payment: 'Paid', status: 'Delivered', details: 'View' },
        { name: 'Satsuki Mei', code: '81475', payment: 'Due', status: 'Pending', details: 'View' },
        { name: 'Rara Kuduo', code: '22821', payment: 'Paid', status: 'Delivered', details: 'View' },
        { name: 'Misaki Azusa', code: '81475', payment: 'Due', status: 'Pending', details: 'View' },
        { name: 'Natsu Toujou', code: '22821', payment: 'Paid', status: 'Delivered', details: 'View' },
        { name: 'Honoko Tsujii', code: '81475', payment: 'Due', status: 'Pending', details: 'View' },
        { name: 'Maina Yuuri', code: '22821', payment: 'Paid', status: 'Delivered', details: 'View' },
        { name: 'Sara Uruki', code: '81475', payment: 'Due', status: 'Pending', details: 'View' },
        { name: 'Rima Arai', code: '00482', payment: 'Paid', status: 'Delivered', details: 'View' }
    ];
    const statusClass = {
        'Pending': 'pending',
        'Declined': 'declined',
        'Delivered': 'delivered'
    };
    function renderRentals(filteredRentals = rentals) {
        const tbody = document.getElementById('rentals-table-body');
        tbody.innerHTML = '';
        filteredRentals.forEach(rental => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${rental.name}</td>
                <td>${rental.code}</td>
                <td>${rental.payment}</td>
                <td class="${statusClass[rental.status] || ''}">${rental.status}</td>
                <td><a href="#">${rental.details}</a></td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Rentals search functionality
    const rentalSearchInput = document.querySelector('.table-search input');
    const rentalClearBtn = document.querySelector('.table-search .bx-x');
    
    if (rentalSearchInput && rentalClearBtn) {
        rentalSearchInput.addEventListener('input', function() {
            const searchValue = this.value.toLowerCase().trim();
            const filteredRentals = rentals.filter(rental => 
                rental.name.toLowerCase().includes(searchValue) ||
                rental.code.toLowerCase().includes(searchValue) ||
                rental.payment.toLowerCase().includes(searchValue) ||
                rental.status.toLowerCase().includes(searchValue)
            );
            renderRentals(filteredRentals);
        });

        rentalClearBtn.addEventListener('click', function() {
            rentalSearchInput.value = '';
            renderRentals();
        });
    }

    // Appointments data
    const appointments = [
        { name: 'Maria Santos', desc: ' has booked an appointment on May 15, 2025', time: '5 Minutes ago', link: '#' },
        { name: 'John Smith', desc: ' has booked an appointment on May 20, 2025', time: '10 Minutes ago', link: '#' },
        { name: 'Sarah Garcia', desc: ' has booked an appointment on May 12, 2025', time: '15 Minutes ago', link: '#' },
        { name: 'Michael Chen', desc: ' has booked an appointment on May 18, 2025', time: '30 Minutes ago', link: '#' },
        { name: 'Emma Wilson', desc: ' has booked an appointment on May 25, 2025', time: '45 Minutes ago', link: '#' },
        { name: 'Sofia Rodriguez', desc: ' has booked an appointment on June 1, 2025', time: '1 Hour ago', link: '#' },
        { name: 'David Kim', desc: ' has booked an appointment on May 30, 2025', time: '2 Hours ago', link: '#' },
        { name: 'Isabella Martinez', desc: ' has booked an appointment on May 22, 2025', time: '3 Hours ago', link: '#' },
        { name: 'James Anderson', desc: ' has booked an appointment on June 5, 2025', time: '4 Hours ago', link: '#' },
        { name: 'Nina Patel', desc: ' has booked an appointment on May 28, 2025', time: '5 Hours ago', link: '#' },
        { name: 'Lucas Brown', desc: ' has booked an appointment on June 3, 2025', time: 'Yesterday', link: '#' },
        { name: 'Mia Thompson', desc: ' has booked an appointment on May 31, 2025', time: 'Yesterday', link: '#' },
        { name: 'Oliver White', desc: ' has booked an appointment on June 2, 2025', time: 'Yesterday', link: '#' },
        { name: 'Ava Johnson', desc: ' has booked an appointment on May 29, 2025', time: '2 Days ago', link: '#' },
        { name: 'Ethan Davis', desc: ' has booked an appointment on June 8, 2025', time: '2 Days ago', link: '#' }
    ];
    function renderAppointments() {
        const ul = document.getElementById('appointments-list');
        ul.innerHTML = '';
        appointments.forEach(app => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="appointment-title"><b>${app.name}</b></div>
                <div class="appointment-desc">${app.desc}</div>
                <span class="appointment-time">${app.time}</span>
                <a class="appointment-view" href="${app.link}">View</a>
            `;
            ul.appendChild(li);
        });
    }

    // Appointments search
    const searchInput = document.getElementById('appointment-search');
    const clearBtn = document.getElementById('clear-search');
    if (searchInput && clearBtn) {
        searchInput.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            const ul = document.getElementById('appointments-list');
            Array.from(ul.children).forEach(li => {
                li.style.display = li.textContent.toLowerCase().includes(value) ? '' : 'none';
            });
        });
        clearBtn.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        });
    }

    // Initial render
    renderRentals();
    renderAppointments();
});