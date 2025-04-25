import {
    appCredential,
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    getDocs,
    getDoc
} from "chandrias-sdk.js";

$(document).ready(function () {
    // NOTYF
    const notyf = new Notyf({
        position: {
            x: "center",
            y: "top"
        }
    });

    // INITIATING FIRESTORE
    const chandriaDB = getFirestore(appCredential);
    // DISPLAYING CARDS
    async function loadProducts() {
        const querySnapshot = await getDocs(collection(chandriaDB, "products"));
        // $("#card_container").empty(); // Clear existing cards

        querySnapshot.forEach(doc => {
            const data = doc.data();

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
                            <h2 class="card_title">${data.productCode}</h2>
                            <p class="card_size">Size: ${data.size}</p>
                            <p class="card_sleeve">Sleeve: ${data.productSleeve}</p>
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

            // Append to container
            $(".card_container").append(card);
        });
    }
    loadProducts();

    // ADDING PRODUCT FUNCTION
    $("#add-product-btn").on("click", async function (e) {
        e.preventDefault();

        // VALIDATING REQUIRED FIELDS
        const frontFile = $("#add-file-front-img")[0].files[0];
        const backFile = $("#add-file-back-img")[0].files[0];

        if (!frontFile && !backFile) {
            notyf.error("Please select both Front and Back View images.");
            return;
        }

        if (!frontFile) {
            notyf.error("Please select a Front View image.");
            return;
        }

        if (!backFile) {
            notyf.error("Please select a Back View image.");
            return;
        }

        // GETTING INPUTS VALUE
        const requiredFields = [
            "#add-product-code",
            "#add-product-prize",
            "#add-product-size",
            "#add-product-color",
            "#add-product-sleeve",
            "#add-product-category"
        ];

        let isValid = true;

        requiredFields.forEach(selector => {
            const value = $(selector).val().trim();
            if (!value) {
                notyf.error(
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
            notyf.error("Select a Category.");
            return;
        }

        // DISPLAYING SPINNER
        const spinner = $("#spinner");
        spinner.removeClass("d-none");

        const spinnerText = $("#spinner-text");
        spinnerText.text("Uploading Image");

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
            return data.secure_url;
        };

        try {
            spinnerText.text("Submitting Data");

            // UPLOAD BOTH IMAGES
            const frontImageUrl = await uploadImage(frontFile);
            const backImageUrl = await uploadImage(backFile);

            // GET FORM DATA
            const productData = {
                productCode: $("#add-product-code").val(),
                prize: $("#add-product-prize").val(),
                size: $("#add-product-size").val(),
                color: $("#add-product-color").val(),
                productSleeve: $("#add-product-sleeve").val(),
                category: $("#add-product-category").val(),
                frontImageUrl: frontImageUrl,
                backImageUrl: backImageUrl,
                createdAt: new Date()
            };

            // SAVE TO FIREBASE
            const docRef = await addDoc(
                collection(chandriaDB, "products"),
                productData
            );
            const newDoc = await getDoc(docRef);
            const newData = newDoc.data();

            // CREATE CARD ELEMENT
            const newCard = $(`
                    <article class="card_article card">
                        <div class="card_data">
                            <span
                                class="card_color"
                                style="background-color: ${newData.color}"
                                data-color="${newData.color}"
                            ></span>
                            <img
                                src="${newData.frontImageUrl}"
                                alt="image"
                                class="card_img"
                                id="product-img"
                            />
                            <h2 class="card_title" id="product-code">${newData.productCode}</h2>
                            <p class="card_size" id="product-size">${newData.size}</p>
                            <p class="card_sleeve" id="product-sleeve">${newData.productSleeve}</p>
                            <span class="card_category" id="product-category">${newData.category}</span>
                            <div class="product-actions">
                                <a
                                    href="#"
                                    class="action-btn edit-btn"
                                    aria-label="Edit"
                                    data-open="viewProductModal"
                                    data-id="${newDoc.id}"
                                >
                                    <i class="fi fi-rr-edit"></i>
                                </a>

                                <a
                                    href="#"
                                    class="action-btn delete-btn"
                                    aria-label="Delete"
                                    data-id="${newDoc.id}"
                                >
                                    <i class="fi fi-rr-trash"></i>
                                </a>
                            </div>
                        </div>
                    </article>
            `);

            // Append the new card
            $(".card_container").append(newCard);
            notyf.success("Product Successfully Added!");

            // RESET FORM
            $("form")[0].reset();
            // RESET IMAGE DROP ZONES
            $("#add-dropzone-front").css("background-image", "none");
            $("#add-upload-label-front").css("opacity", "1");

            $("#add-dropzone-back").css("background-image", "none");
            $("#add-upload-label-back").css("opacity", "1");

            // CLOSING MODAL
            const addModal = $("#addProductModal");
            setTimeout(() => {
                addModal.removeClass("show");
            }, 900);
        } catch (err) {
            console.error("Upload failed:", err);
            alert("There was an error uploading the product.");
        }

        spinner.addClass("d-none");
    });

    // VIEW DETAILS FUNCTION
    $(".card_container").on("click", ".edit-btn", async function () {
        const productId = $(this).data("id");

        try {
            const docRef = doc(chandriaDB, "products", productId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                // CONVERTING DATE TO STRING
                // const dateString = data.createdAt
                //     ? data.createdAt.toDate().toLocaleString()
                //     : "N/A";

                // SET IMAGE PREVIEWS
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

                // FILL MODAL INPUTS
                $("#update-product-id").val(productId);
                $("#update-product-code").val(data.productCode);
                $("#update-product-prize").val(data.prize);
                $("#update-product-size").val(data.size);
                $("#update-product-color").val(data.color);
                $("#update-product-sleeve").val(data.productSleeve);
                $("#update-product-category").val(data.category);
            } else {
                notyf.error("Product not found.");
            }
        } catch (error) {
            console.error("Error getting product:", error);
            notyf.error("Failed to load product.");
        }
    });

    // UPDATE PRODUCT FUNCTION
    $("#update-product-btn").on("click", async function (e) {
        e.preventDefault();

        const productId = $("#update-product-id").val();
        if (!productId) {
            notyf.error("Product ID not found.");
            return;
        }

        const requiredFields = [
            "#update-product-code",
            "#update-product-prize",
            "#update-product-size",
            "#update-product-color",
            "#update-product-sleeve",
            "#update-product-category"
        ];

        let isValid = true;
        requiredFields.forEach(selector => {
            const value = $(selector).val().trim();
            if (!value) {
                notyf.error(
                    `Please fill out ${selector.replace(
                        "#view-product-",
                        "Product "
                    )}.`
                );
                isValid = false;
            }
        });
        if (!isValid) return;

        // CONVERTING TO ALL CAPS
        // let $productCode = $("#view-product-code");
        // let value = $productCode
        //     .val()
        //     .toUpperCase()
        //     .replace(/[^A-Z0-9]/g, "")
        //     .slice(0, 6);
        // $productCode.val(value);
        // const productCode = value;

        // START SPINNER
        $("#spinner").removeClass("d-none");
        $("#spinner-text").text("Updating Product");

        // GETTING FILE INPUTS
        const frontFile = $("#update-file-front-img")[0].files[0];
        const backFile = $("#update-file-back-img")[0].files[0];

        let frontImageUrl = null;
        let backImageUrl = null;

        try {
            // Upload Front Image
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
            }

            // Upload Back Image
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
            }

            // BUILD UPDATED DATA
            const updatedData = {
                productCode: $("#update-product-code").val(),
                prize: $("#update-product-prize").val(),
                size: $("#update-product-size").val(),
                color: $("#update-product-color").val(),
                productSleeve: $("#update-product-sleeve").val(),
                category: $("#update-product-category").val()
            };

            // Add image URLs if uploaded
            if (frontImageUrl) updatedData.frontImageUrl = frontImageUrl;
            if (backImageUrl) updatedData.backImageUrl = backImageUrl;

            const docRef = doc(chandriaDB, "products", productId);
            await updateDoc(docRef, updatedData);

            // UPDATES THE CARD DATA
            const card = $(`.edit-btn[data-id='${productId}']`).closest(
                ".card"
            );
            if (card.length) {
                card.find("img").attr(
                    "src",
                    frontImageUrl || card.find("img").attr("src")
                );
                card.find(".card_title").text(updatedData.productCode);
                
                card.find(".card_size").text(`Size: ${updatedData.size}`);
                card.find(".card_sleeve").text(`Sleeve: ${updatedData.productSleeve}`);
                card.find(".card_category").text(updatedData.category);
                card.find(".card_color").css("background-color", updatedData.color);
            }

            notyf.success("Product updated successfully!");
            setTimeout(() => {
                $("#viewProductModal").removeClass("show");
            }, 800);
            //
        } catch (error) {
            console.error("Error updating product:", error);
            notyf.error("Failed to update product.");
        } finally {
            $("#spinner").addClass("d-none");
        }
    });

    // DELETE CARD FUNCTION
    $(".card_container").on("click", ".delete-btn", async function () {
        const productId = $(this).data("id");
        const card = $(this).closest(".card");

        const confirmed = confirm(
            "Are you sure you want to delete this product?"
        );

        if (confirmed) {
            try {
                await deleteDoc(doc(chandriaDB, "products", productId));
                notyf.success("Product Deleted!");
                card.remove(); // REMOVES THE DISPLAYED CARD
            } catch (error) {
                console.error("Error deleting product:", error);
                notyf.error("Failed to delete product.");
            }
        }
    });

    // COLOR PREVIEW
    // $("#add-product-color").on("input", function () {
    //     const selectedColor = $(this).val();
    //     $("#add-color-preview").val(selectedColor);
    // });

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
});