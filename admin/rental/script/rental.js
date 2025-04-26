import {
    appCredential,
    getFirestore,
    collection,
    getDocs
} from "./chandrias-sdk.js";

$(document).ready(function () {
    // VARIABLE DB
    const chandriaDB = getFirestore(appCredential);

    // DISPLAY PRODUCTS FUNCTION
    async function displayProducts() {
        const querySnapshot = await getDocs(collection(chandriaDB, "products"));

        // FETCHING DATA FROM DATABASE
        querySnapshot.forEach(doc => {
            const data = doc.data();

            // DISPLAYING DATA TO TABLE
            const card = `
            <div class="pos-card" data-id="${doc.id}">
                <img src="${data.frontImageUrl}" alt="Gown" class="pos-img">
                    <div class="pos-info">
                        <div class="pos-name">${data.productCode}</div>
                        <div class="pos-price">₱${data.prize}</div>
                    </div>
            </div>

                
            `;

            // APPEND TO CONTAINER
            $(".pos-products").append(card);
        });
    }
    displayProducts();

    // --- EVENT TYPE FEE LOGIC ---
    // Removed event type logic as requested

    // --- PAYMENT METHOD REFERENCE NO LOGIC ---
    const paymentMethodSelector = $('#payment-method');
    const referenceNoInput = $('#reference-no');

    paymentMethodSelector.on('change', function () {
        let method = $(this).val();
        if (method === 'Cash') {
            referenceNoInput.val('CASH').prop('readonly', true);
        } else {
            referenceNoInput.val('').prop('readonly', false);
        }
    });

    // Optionally, trigger the logic on page load if values are pre-filled
    eventTypeSelector.trigger('change');
    paymentMethodSelector.trigger('change');

    // Patch: When modal is shown, trigger the custom event
    if ($('#customer-modal').is(':visible')) {
        $('#customer-modal').trigger('showModal');
    }
});
``