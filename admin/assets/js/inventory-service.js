//INVENTORY JS
import {
    chandriaDB,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    getDocs,
    getDoc,
    query,
    where
} from "./sdk/chandrias-sdk.js";

// ERROR MODAL FUNCTION
function showErrorModal(message) {
    const modal = document.getElementById("error-modal");
    const msg = document.getElementById("error-modal-message");
    msg.textContent = message;
    modal.classList.add("show");
}

// --- Confirm Modal Logic ---
function showConfirmModal(message, onConfirm) {
    const modal = document.getElementById("confirm-modal");
    const msg = document.getElementById("confirm-modal-message");
    msg.textContent = message;
    modal.classList.add("show");
    // Remove previous listeners
    const okBtn = document.getElementById("confirm-modal-ok");
    const cancelBtn = document.getElementById("confirm-modal-cancel");
    const closeBtn = document.querySelector(".confirm-close");
    function cleanup() {
        modal.classList.remove("show");
        okBtn.removeEventListener("click", okHandler);
        cancelBtn.removeEventListener("click", cancelHandler);
        closeBtn.removeEventListener("click", cancelHandler);
    }
    function okHandler() {
        cleanup();
        if (onConfirm) onConfirm();
    }
    function cancelHandler() {
        cleanup();
    }
    okBtn.addEventListener("click", okHandler);
    cancelBtn.addEventListener("click", cancelHandler);
    closeBtn.addEventListener("click", cancelHandler);
}

// INTITIALIZE NOTYF
$(document).ready(function () {
    // NOTYF
    const notyf = new Notyf({
        position: {
            x: "center",
            y: "top"
        }
    });

    // Error modal close logic
    $(document).on("click", ".error-close, #error-modal-ok", function () {
        $("#error-modal").removeClass("show");
    });
    window.addEventListener("click", function (event) {
        const modal = document.getElementById("error-modal");
        if (event.target === modal) modal.classList.remove("show");
    });

    // #@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@#
    // DISPLAY CARDS FUNCTION
    async function loadProducts() {
        try {
            const container = $(".card_container");
            container.empty(); // Clear existing cards to avoid duplicates
            const querySnapshot = await getDocs(
                collection(chandriaDB, "products")
            );
            if (querySnapshot.empty) {
                container.append(
                    '<div style="margin:2rem;">No products found in inventory.</div>'
                );
                return;
            }
            querySnapshot.forEach(doc => {
                const data = doc.data();
                // Defensive: check for required fields
                if (!data.frontImageUrl || !data.code) {
                    console.warn(
                        "Product missing image or code:",
                        doc.id,
                        data
                    );
                    return;
                }
                // Create the card HTML
                const card = $(`
                  <article class="card_article card">
                    <div class="card_data">
                        <span
                            class="card_color"
                            style="background-color: ${data.color}"
                            data-color="${data.color}"
                        ></span>
                        <img
                            src="${data.frontImageUrl}"
                            alt="image"
                            class="card_img"
                            id="product-img"
                        />
                        <h2 class="card_title">${data.name}</h2> 
                        <p class="card_size">Available Size: ${Object.keys(
                            data.size
                        ).join(", ")}</p>                     
                        <p class="card_sleeve">Sleeve: ${data.sleeve}</p>
                        <span class="card_category">${data.category}</span>
                        <div class="product-actions">
                            <a
                                href="#"
                                class="action-btn edit-btn"
                                aria-label="Edit"
                                data-open="viewProductModal"
                                data-id="${doc.id}"
                            >
                                <i class="fi fi-rr-edit"></i>
                            </a>
                            <a
                                href="#"
                                class="action-btn delete-btn"
                                aria-label="Delete"
                                data-id="${doc.id}"
                            >
                                <i class="fi fi-rr-trash"></i>
                            </a>
                        </div>
                    </div>
                </article>
                `);
                container.append(card);
            });
        } catch (err) {
            console.error("Error loading products from Firebase:", err);
            $(".card_container").append(
                '<div style="color:red;margin:2rem;">Failed to load products. Check your connection or Firebase rules.</div>'
            );
        }
    }
    loadProducts();

    // RGB TO HEX FUNCTION
    function rgbToHex(rgb) {
        const rgbMatch = rgb.match(/\d+/g);
        return (
            "#" +
            rgbMatch
                .map(x => parseInt(x).toString(16).padStart(2, "0"))
                .join("")
        );
    }

    // CATEGORY & COLOR CODE MAPPINGS
    const categoryCodes = {
        "Ball Gown": "BGWN",
        "Long Gown": "LGWN",
        "Wedding Gown": "WGWN",
        "Fairy Gown": "FGWN",
        Suits: "SUIT"
    };

    const colorCodes = {
        Beige: "BEI",
        White: "WHI",
        Black: "BLK",
        Red: "RED",
        Blue: "BLU",
        Yellow: "YEL",
        Green: "GRN",
        Orange: "ORN",
        Purple: "PUR",
        Gray: "GRY",
        Brown: "BRN",
        Cream: "CRM"
    };

    // GENERATE PRODUCT CODE FUNCTION
    async function generateProductCode(category, color) {
        const categoryCode = categoryCodes[category];
        const colorCode = colorCodes[color];
        const baseCode = `${categoryCode}-${colorCode}`;

        const productsRef = collection(chandriaDB, "products");
        const q = query(
            productsRef,
            where("code", ">=", baseCode),
            where("code", "<", baseCode + "\uf8ff")
        );
        const snapshot = await getDocs(q);

        const numbers = snapshot.docs.map(doc => {
            const match = doc.data().code.match(/(\d{3})$/);
            return match ? parseInt(match[1], 10) : 0;
        });

        const nextNumber = (Math.max(...numbers, 0) + 1)
            .toString()
            .padStart(3, "0");
        return `${baseCode}-${nextNumber}`;
    }

    // GENERATE ON INPUT TYPE
    $("#add-product-category, #add-product-color").on(
        "change",
        async function () {
            const category = $("#add-product-category").val();
            const color = $("#add-product-color").val();

            if (
                category !== "Select Category" &&
                color !== "Select Color" &&
                categoryCodes[category] &&
                colorCodes[color]
            ) {
                const code = await generateProductCode(category, color);
                $("#add-product-code").val(code);
            }
        }
    );

    $("#update-product-category, #update-product-color").on(
        "change",
        async function () {
            const category = $("#update-product-category").val();
            const color = $("#update-product-color").val();

            if (
                category !== "Select Category" &&
                color !== "Select Color" &&
                categoryCodes[category] &&
                colorCodes[color]
            ) {
                const code = await generateProductCode(category, color);
                $("#update-product-code").val(code);
            }
        }
    );

    // #@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@#
    // ADDING PRODUCT FUNCTION
    $("#add-product-btn").on("click", async function (e) {
        e.preventDefault();

        // VALIDATING REQUIRED FIELDS
        const frontFile = $("#add-file-front-img")[0].files[0];
        const backFile = $("#add-file-back-img")[0].files[0];

        if (!frontFile && !backFile) {
            showErrorModal("Please select both Front and Back View images.");
            return;
        }

        if (!frontFile) {
            showErrorModal("Please select a Front View image.");
            return;
        }

        if (!backFile) {
            showErrorModal("Please select a Back View image.");
            return;
        }

        // GETTING INPUTS VALUE
        const requiredFields = [
            "#add-product-name",
            "#add-product-price",
            "#add-product-color",
            "#add-product-sleeve",
            "#add-product-category",
            "#add-product-description"
        ];

        let isValid = true;

        requiredFields.forEach(selector => {
            const value = $(selector).val().trim();
            if (!value) {
                showErrorModal(
                    `Please fill out ${selector.replace(
                        "#add-product-",
                        "Product "
                    )}.`
                );
                isValid = false;
            }
        });
        if (!isValid) return;

        const selectCategory = $("#add-product-category").val();
        if (selectCategory == "Select Category") {
            showErrorModal("Select a Category.");
            return;
        }

        // Price should not be negative
        const priceValue = parseFloat($("#add-product-price").val());
        if (isNaN(priceValue) || priceValue < 0) {
            showErrorModal("Product price cannot be negative.");
            return;
        }

        // DISPLAYING SPINNER
        const spinnerText = $("#spinner-text");
        const spinner = $("#spinner");

        // FUNCTION TO UPLOAD SINGLE IMAGE
        const uploadImage = async file => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "UPLOAD_IMG");

            const response = await fetch(
                "https://api.cloudinary.com/v1_1/dbtomr3fm/image/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();
            return {
                url: data.secure_url,
                public_id: data.public_id // Save this
            };
        };

        // COLLECT SIZE + QUANTITY DATA
        const sizes = {};
        let sizeValid = true;

        // Get all checked size checkboxes
        const checkedSizes = $('input[name="add-product-size"]:checked');

        if (checkedSizes.length === 0) {
            showErrorModal("Please select at least one size.");
            return;
        }

        checkedSizes.each(function () {
            const size = $(this).val();
            const qty = parseInt($(`#qty-${size}`).val());

            if (!isNaN(qty) && qty > 0) {
                sizes[size] = qty;
            } else {
                showErrorModal(
                    `Please enter a valid quantity for size ${size}.`
                );
                sizeValid = false;
                return false; // Break loop on invalid input
            }
        });
        if (!sizeValid) return;

        try {
            spinner.removeClass("d-none");
            // GENERATE PRODUCT CODE BEFORE SUBMITTING
            const categoryText = $("#add-product-category").val();
            const colorText = $("#add-product-color").val();
            const productCode = await generateProductCode(
                categoryText,
                colorText
            );

            spinnerText.text("Uploading Image");
            // UPLOAD BOTH IMAGES
            const frontImage = await uploadImage(frontFile);
            const backImage = await uploadImage(backFile);

            // CONVERTING RGB TO HEX
            const rgb = $("#add-product-color option:selected").css("color");
            const hex = rgbToHex(rgb);

            // GET FORM DATA
            const productData = {
                name: $("#add-product-name").val(),
                code: productCode,
                price: $("#add-product-price").val(),
                size: sizes,
                color: hex,
                sleeve: $("#add-product-sleeve").val(),
                category: categoryText,
                description: $("#add-product-description").val(),
                frontImageUrl: frontImage.url,
                backImageUrl: backImage.url,
                frontImageId: frontImage.public_id,
                backImageId: backImage.public_id,
                createdAt: new Date()
            };

            spinnerText.text("Submitting Data");
            // SAVE TO FIREBASE
            const docRef = await addDoc(
                collection(chandriaDB, "products"),
                productData
            );

            //ReLOADS THE PRODUCTS
            await loadProducts();

            // SHOW SUCCESS MESSAGE
            notyf.success("Product Successfully Added!");

            // RESET FORM
            $("#addProductForm")[0].reset();
            // CLEAR SIZE QUANTITY INPUTS
            $("#add-selected-size-container").empty();
            // RESET IMAGE DROP ZONES
            $("#add-dropzone-front").css("background-image", "none");
            $("#add-upload-label-front").css("opacity", "1");

            $("#add-dropzone-back").css("background-image", "none");
            $("#add-upload-label-back").css("opacity", "1");

            // CLOSING MODAL
            $("#addProductModal").removeClass("show");
        } catch (err) {
            console.error("Upload failed:", err);
            showErrorModal("There was an error uploading the product.");
        }

        spinner.addClass("d-none");
    });

    // BASE 64 SIGNATURE
    async function generateSignature(publicId, timestamp, apiSecret) {
        const dataToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(dataToSign);

        const hashBuffer = await crypto.subtle.digest("SHA-1", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }

    // DELETE REQUEST FUNCTION
    async function deleteImageFromCloudinary(publicId) {
        const apiKey = "814782524531725";
        const apiSecret = "9vWGOUYipmrq2ecCato2G9MTA7Q"; // exposed, unsafe
        const cloudName = "dbtomr3fm";
        const timestamp = Math.floor(Date.now() / 1000);

        const signature = await generateSignature(
            publicId,
            timestamp,
            apiSecret
        );

        const formData = new FormData();
        formData.append("public_id", publicId);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.json();
        console.log("Delete result:", result);

        if (result.result !== "ok") {
            console.error("Cloudinary deletion failed:", result);
            throw new Error(`Image deletion failed: ${publicId}`);
        }

        return result;
    }

    // #@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@#
    // DELETE CARD FUNCTION
    $(document).on("click", ".delete-btn", async function () {
        const productId = $(this).data("id");
        const card = $(this).closest(".card");

        // DISPLAYING SPINNER
        const spinner = $("#spinner");
        const spinnerText = $("#spinner-text");

        showConfirmModal(
            "Are you sure you want to delete this product?",
            async function () {
                try {
                    spinner.removeClass("d-none");
                    spinnerText.text("Deleting Image");
                    // Step 1: Get product info from Firestore
                    const docSnap = await getDoc(
                        doc(chandriaDB, "products", productId)
                    );
                    const product = docSnap.data();

                    // Step 2: Delete images
                    await deleteImageFromCloudinary(product.frontImageId);
                    await deleteImageFromCloudinary(product.backImageId);

                    spinnerText.text("Deleting Data");

                    // Step 3: Delete product record
                    await deleteDoc(doc(chandriaDB, "products", productId));
                    notyf.success("Product Deleted!");
                    card.remove();
                    spinner.addClass("d-none");
                } catch (err) {
                    console.error("Error:", err);
                    showErrorModal("Failed to delete product or images.");
                }
            }
        );
    });

    // #@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@#
    // SIZE CHECKBOX FUNCTION
    $('input[name="add-product-size"]').change(function () {
        const size = $(this).val();
        const container = $("#add-selected-size-container");
        const inputId = `qty-${size}`;

        if ($(this).is(":checked")) {
            if (!$(`#${inputId}`).length) {
                const inputGroup = `
                        <div class="qty-group" id="group-${size}">
                            <label for="${inputId}">Quantity for ${size}:</label>
                            <input type="number" id="${inputId}" name="${inputId}" min="0" />
                        </div>`;
                container.append(inputGroup);
            }
        } else {
            $(`#group-${size}`).remove();
        }
    });
    $('input[name="update-product-size"]').change(function () {
        const size = $(this).val();
        const container = $("#update-selected-size-container");
        const inputId = `qty-${size}`;

        if ($(this).is(":checked")) {
            if (!$(`#${inputId}`).length) {
                const inputGroup = `
                        <div class="qty-group" id="group-${size}">
                            <label for="${inputId}">Quantity for ${size}:</label>
                            <input type="number" id="${inputId}" name="${inputId}" min="0" />
                        </div>`;
                container.append(inputGroup);
            }
        } else {
            $(`#group-${size}`).remove();
        }
    });

    // #@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@#
    // VIEW DETAILS FUNCTION
    $(document).on("click", ".edit-btn", async function () {
        const productId = $(this).data("id");

        try {
            const docRef = doc(chandriaDB, "products", productId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                // Set image previews
                if (data.frontImageUrl) {
                    $("#update-dropzone-front").css({
                        "background-image": `url(${data.frontImageUrl})`,
                        "background-size": "cover",
                        "background-position": "center"
                    });
                    $("#update-upload-label-front").css("opacity", "0");
                }
                if (data.backImageUrl) {
                    $("#update-dropzone-back").css({
                        "background-image": `url(${data.backImageUrl})`,
                        "background-size": "cover",
                        "background-position": "center"
                    });
                    $("#update-upload-label-back").css("opacity", "0");
                }

                // Fill text inputs
                $("#update-product-id").val(productId);
                $("#update-product-name").val(data.name);
                $("#update-product-price").val(data.price);
                $("#update-product-code").val(data.code);
                $("#update-product-description").val(data.description);

                // Set category
                $("#update-product-category").val(data.category);

                // Set sleeve
                $("#update-product-sleeve").val(data.sleeve);

                // Set color using hex style matching
                const colorOptions = $("#update-product-color option");
                colorOptions.each(function () {
                    const optionColor = rgbToHex($(this).css("color"));
                    if (
                        optionColor.toLowerCase() === data.color.toLowerCase()
                    ) {
                        $(this).prop("selected", true);
                    }
                });

                // Set sizes and quantities
                const sizeData = data.size || {}; // e.g., { S: 3, M: 5 }
                const selectedSizes = Object.keys(sizeData);

                // Check checkboxes and trigger change event to auto-generate inputs
                $("input[name='update-product-size']").each(function () {
                    const size = $(this).val();
                    if (selectedSizes.includes(size)) {
                        $(this).prop("checked", true).trigger("change");
                    } else {
                        $(this).prop("checked", false).trigger("change");
                    }
                });

                // After inputs are created by the change handler, set their values
                selectedSizes.forEach(size => {
                    const inputId = `qty-${size}`;
                    const input = $(`#${inputId}`);
                    if (input.length) {
                        input.val(sizeData[size]);
                    }
                });
            } else {
                showErrorModal("Product not found.");
            }
        } catch (error) {
            console.error("Error getting product:", error);
            showErrorModal("Failed to load product.");
        }
    });

    // #@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@#
    // UPDATE PRODUCT FUNCTION
    $("#update-product-btn").on("click", async function (e) {
        e.preventDefault();

        const productId = $("#update-product-id").val();
        if (!productId) return showErrorModal("Product ID not found.");

        // Validate required fields
        const requiredFields = [
            "#update-product-name",
            "#update-product-code",
            "#update-product-price",
            "#update-product-color",
            "#update-product-sleeve",
            "#update-product-category",
            "#update-product-description"
        ];

        for (let selector of requiredFields) {
            const value = $(selector).val().trim();
            if (!value) {
                showErrorModal(
                    `Please fill out ${selector.replace(
                        "#update-product-",
                        "Product "
                    )}.`
                );
                return;
            }
        }

        // Validate price
        const priceValue = parseFloat($("#update-product-price").val());
        if (isNaN(priceValue) || priceValue < 0) {
            return showErrorModal("Product price cannot be negative.");
        }

        const frontFile = $("#update-file-front-img")[0].files[0];
        const backFile = $("#update-file-back-img")[0].files[0];

        // Collect size and quantity
        const sizes = {};
        const checkedSizes = $('input[name="update-product-size"]:checked');
        if (checkedSizes.length === 0)
            return showErrorModal("Please select at least one size.");

        for (let i = 0; i < checkedSizes.length; i++) {
            const size = $(checkedSizes[i]).val();
            const qty = parseInt($(`#qty-${size}`).val());
            if (!isNaN(qty) && qty > 0) {
                sizes[size] = qty;
            } else {
                showErrorModal(
                    `Please enter a valid quantity for size ${size}.`
                );
                return;
            }
        }

        let frontImageUrl = null;
        let backImageUrl = null;
        let frontImageId = null;
        let backImageId = null;

        try {
            // Show loading spinner
            $("#spinner").removeClass("d-none");
            $("#spinner-text").text("Updating Product...");

            // Fetch current product data
            const docSnap = await getDoc(
                doc(chandriaDB, "products", productId)
            );
            const existingProduct = docSnap.data();

            // DELETE OLD FRONT IMAGE IF NEW ONE IS PROVIDED
            if (frontFile && existingProduct.frontImageId) {
                $("#spinner-text").text("Deleting Old Front Image...");
                await deleteImageFromCloudinary(existingProduct.frontImageId);
            }

            // DELETE OLD BACK IMAGE IF NEW ONE IS PROVIDED
            if (backFile && existingProduct.backImageId) {
                $("#spinner-text").text("Deleting Old Back Image...");
                await deleteImageFromCloudinary(existingProduct.backImageId);
            }

            // UPLOAD NEW FRONT IMAGE
            if (frontFile) {
                $("#spinner-text").text("Uploading Front Image...");
                const formDataFront = new FormData();
                formDataFront.append("file", frontFile);
                formDataFront.append("upload_preset", "UPLOAD_IMG");

                const responseFront = await fetch(
                    "https://api.cloudinary.com/v1_1/dbtomr3fm/image/upload",
                    {
                        method: "POST",
                        body: formDataFront
                    }
                );
                const dataFront = await responseFront.json();
                frontImageUrl = dataFront.secure_url;
                frontImageId = dataFront.public_id;
            }

            // UPLOAD NEW BACK IMAGE
            if (backFile) {
                $("#spinner-text").text("Uploading Back Image...");
                const formDataBack = new FormData();
                formDataBack.append("file", backFile);
                formDataBack.append("upload_preset", "UPLOAD_IMG");

                const responseBack = await fetch(
                    "https://api.cloudinary.com/v1_1/dbtomr3fm/image/upload",
                    {
                        method: "POST",
                        body: formDataBack
                    }
                );
                const dataBack = await responseBack.json();
                backImageUrl = dataBack.secure_url;
                backImageId = dataBack.public_id;
            }

            // Convert RGB color to HEX
            const rgb = $("#update-product-color option:selected").css("color");
            const hex = rgbToHex(rgb);

            // Prepare the data object for update
            const updatedData = {
                name: $("#update-product-name").val(),
                price: priceValue,
                size: sizes,
                color: hex,
                sleeve: $("#update-product-sleeve").val(),
                category: $("#update-product-category").val(),
                code: $("#update-product-code").val(),
                description: $("#update-product-description").val()
            };

            // Include new image URLs/IDs if updated
            if (frontImageUrl && frontImageId) {
                updatedData.frontImageUrl = frontImageUrl;
                updatedData.frontImageId = frontImageId;
            }
            if (backImageUrl && backImageId) {
                updatedData.backImageUrl = backImageUrl;
                updatedData.backImageId = backImageId;
            }

            // Update Firestore document
            const docRef = doc(chandriaDB, "products", productId);
            await updateDoc(docRef, updatedData);

            // Reload updated products
            await loadProducts();

            notyf.success("Product updated successfully!");

            // Reset the form
            $("#updateProductForm")[0].reset();

            // Close the modal
            $("#viewProductModal").removeClass("show");
        } catch (error) {
            console.error("Error updating product:", error);
            showErrorModal("Failed to update product.");
        } finally {
            // Hide spinner
            $("#spinner").addClass("d-none");
        }
    });

    // #@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@##@#@#@#@#@#@#@#@#@#
    // IMAGE PREVIEW
    $("#add-file-front-img").on("change", function () {
        const file = this.files[0];

        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = function (e) {
                $("#add-dropzone-front").css({
                    "background-image": `url(${e.target.result})`,
                    "background-size": "cover",
                    "background-position": "center"
                });

                $("#add-upload-label-front").css("opacity", "0");
            };

            reader.readAsDataURL(file);
        }
    });

    $("#add-file-back-img").on("change", function () {
        const file = this.files[0];

        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = function (e) {
                $("#add-dropzone-back").css({
                    "background-image": `url(${e.target.result})`,
                    "background-size": "cover",
                    "background-position": "center"
                });

                $("#add-upload-label-back").css("opacity", "0");
            };

            reader.readAsDataURL(file);
        }
    });

    $("#update-file-front-img").on("change", function () {
        const file = this.files[0];

        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = function (e) {
                $("#update-dropzone-front").css({
                    "background-image": `url(${e.target.result})`,
                    "background-size": "cover",
                    "background-position": "center"
                });

                $("#update-upload-label-front").css("opacity", "0");
            };

            reader.readAsDataURL(file);
        }
    });

    $("#update-file-back-img").on("change", function () {
        const file = this.files[0];

        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = function (e) {
                $("#update-dropzone-back").css({
                    "background-image": `url(${e.target.result})`,
                    "background-size": "cover",
                    "background-position": "center"
                });

                $("#update-upload-label-back").css("opacity", "0");
            };

            reader.readAsDataURL(file);
        }
    });

    // --- TAB & ADD BUTTON LOGIC ---
    const addItemBtn = $("#add-item-btn");
    const addProductModal = $("#addProductModal");
    const addAdditionalModal = $("#addAdditionalModal");
    const tabBtns = $(".tab-btn");

    function setAddButtonForTab(tab) {
        if (tab === "products") {
            addItemBtn.text("Add Product");
            addItemBtn.attr("data-open", "addProductModal");
        } else if (tab === "accessories") {
            addItemBtn.text("Add Additional");
            addItemBtn.attr("data-open", "addAdditionalModal");
        }
    }

    tabBtns.on("click", function () {
        const tab = $(this).data("tab");
        setAddButtonForTab(tab);
    });

    // Open correct modal when add button is clicked
    addItemBtn.on("click", function (e) {
        e.preventDefault();

        const modalTarget = $(this).attr("data-open");
        // Always close both modals before opening the target
        addProductModal.removeClass("show");
        addAdditionalModal.removeClass("show");
        if (modalTarget === "addProductModal") {
            addProductModal.addClass("show");
        } else if (modalTarget === "addAdditionalModal") {
            addAdditionalModal.addClass("show");
        }
        setBodyScrollLock(true);
    });

    // --- ADDITIONAL FORM SUBMISSION ---
    $("#add-additional-btn").on("click", async function (e) {
        e.preventDefault();
        const imgFile = $("#add-additional-file-img")[0].files[0];
        const name = $("#add-additional-name").val().trim();
        const type = $("#add-additional-type").val().trim();
        const price = $("#add-additional-price").val().trim();
        if (!imgFile) {
            showErrorModal("Please select an image.");
            return;
        }
        if (!name) {
            showErrorModal("Please enter a name.");
            return;
        }
        if (!type) {
            showErrorModal("Please enter a type.");
            return;
        }
        if (!price || parseFloat(price) < 0) {
            showErrorModal("Please enter a valid price.");
            return;
        }
        // Show spinner
        $("#spinner").removeClass("d-none");
        $("#spinner-text").text("Uploading Image");
        // Upload image
        try {
            const formData = new FormData();
            formData.append("file", imgFile);
            formData.append("upload_preset", "UPLOAD_IMG");
            const response = await fetch(
                "https://api.cloudinary.com/v1_1/dbtomr3fm/image/upload",
                {
                    method: "POST",
                    body: formData
                }
            );
            const data = await response.json();
            const imageUrl = data.secure_url;
            // Save to Firestore (collection: accessories)
            const additionalData = {
                name,
                type,
                price,
                imageUrl,
                createdAt: new Date()
            };
            await addDoc(collection(chandriaDB, "accessories"), additionalData);
            notyf.success("Additional item added!");
            // Reset form
            $("#add-additional-name").val("");
            $("#add-additional-type").val("");
            $("#add-additional-price").val("");
            $("#add-additional-dropzone-img").css("background-image", "none");
            $("#add-additional-upload-label-img").css("opacity", "1");
            setTimeout(() => {
                addAdditionalModal.removeClass("show");
            }, 900);
        } catch (err) {
            showErrorModal("Failed to add additional item.");
        }
        $("#spinner").addClass("d-none");
    });

    // --- ADDITIONAL IMAGE PREVIEW ---
    $("#add-additional-file-img").on("change", function () {
        const file = this.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $("#add-additional-dropzone-img").css({
                    "background-image": `url(${e.target.result})`,
                    "background-size": "cover",
                    "background-position": "center"
                });
                $("#add-additional-upload-label-img").css("opacity", "0");
            };
            reader.readAsDataURL(file);
        }
    });

    // Prevent background scroll when any modal is open (strict)
    function setBodyScrollLock(lock) {
        if (lock) {
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
        } else {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        }
    }
    // Open modal: lock scroll
    $(document).on(
        "click",
        '[data-open="addProductModal"], [data-open="viewProductModal"], [data-open="addAdditionalModal"]',
        function () {
            setBodyScrollLock(true);
        }
    );
    // Close modal: unlock scroll
    $(document).on("click", "[data-close]", function () {
        var modalId = $(this).attr("data-close");
        $("#" + modalId).removeClass("show");
        setBodyScrollLock(false);

        // Optional: Reset form
        $("#updateProductForm")[0].reset();
        // CLEAR SIZE QUANTITY INPUTS
        $("#update-selected-size-container").empty();
        // RESET IMAGE DROP ZONES
        $("#update-dropzone-front").css("background-image", "none");
        $("#update-upload-label-front").css("opacity", "1");

        $("#update-dropzone-back").css("background-image", "none");
        $("#update-upload-label-back").css("opacity", "1");
    });

    // Also unlock scroll when clicking modal close X or background
    $(document).on("click", ".custom-close-button", function () {
        setBodyScrollLock(false);

        // Optional: Reset form
        $("#updateProductForm")[0].reset();
        // CLEAR SIZE QUANTITY INPUTS
        $("#update-selected-size-container").empty();
        // RESET IMAGE DROP ZONES
        $("#update-dropzone-front").css("background-image", "none");
        $("#update-upload-label-front").css("opacity", "1");

        $("#update-dropzone-back").css("background-image", "none");
        $("#update-upload-label-back").css("opacity", "1");
    });

    $(window).on("click", function (e) {
        if ($(e.target).hasClass("custom-modal")) {
            $(e.target).removeClass("show");
            setBodyScrollLock(false);

            // Optional: Reset form
            $("#updateProductForm")[0].reset();
            // CLEAR SIZE QUANTITY INPUTS
            $("#update-selected-size-container").empty();
            // RESET IMAGE DROP ZONES
            $("#update-dropzone-front").css("background-image", "none");
            $("#update-upload-label-front").css("opacity", "1");

            $("#update-dropzone-back").css("background-image", "none");
            $("#update-upload-label-back").css("opacity", "1");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            tabBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            tabContents.forEach(tc => tc.classList.remove("active"));
            const tab = this.getAttribute("data-tab");
            document.getElementById(tab).classList.add("active");
        });
    });
});
