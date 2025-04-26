import {
    appCredential,
    getFirestore,
    collection,
    getDocs
} from "./chandrias-sdk.js";

$(document).ready(function () {
    // Initialize Firestore
    const chandriaDB = getFirestore(appCredential);

    // DISPLAY APPOINTMENTS FUNCTION
    async function displayAppointments() {
        const querySnapshot = await getDocs(collection(chandriaDB, "appointments"));

        let appointmentID = 1; // 🔥 Move outside to correctly increment per document

        // FETCH AND DISPLAY DATA
        querySnapshot.forEach(doc => {
            const data = doc.data();

            // Build appointment row
            const appointment = `            
                <tr>
                    <td>${appointmentID++}</td>
                    <td>${data.customerName}</td>
                    <td>${data.customerEmail}</td>
                    <td>${data.checkoutDate} ${data.checkoutTime}</td>
                    <td class="status-upcoming">${data.checkoutStatus || 'Upcoming'}</td>
                    <td><button class="view-product-btn">View</button></td>
                </tr>
            `;

            // Append to the table body
            $("#appointment-body").append(appointment);
        });
    }

    displayAppointments();
});
