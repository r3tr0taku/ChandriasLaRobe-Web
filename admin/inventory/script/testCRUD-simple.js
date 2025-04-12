import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    getDocs,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { app } from "./firebase-sdk.js";

$(document).ready(function () {
    // VARIABLE DB
    const chandriaDB = getFirestore(app);

    // VARIABLES
    const submitProduct = $("button[name='submitProduct']");
    const tableBody = $("table[name='tableDisplay'] tbody");
    const table = $("#productsTable").DataTable();

    const alertBox = $("#alert-box");
    const successIcon = $("#alert-success-icon");
    const dangerIcon = $("#alert-danger-icon");
    const alertMessage = $("#alert-message");

    const mainView = $("#main-view");

    // DISPLAY PRODUCTS FUNCTION
    async function displayProducts() {
        const querySnapshot = await getDocs(collection(chandriaDB, "products"));

        let counter = 1;
        table.clear();

        // FETCHING DATA FROM DATABASE
        querySnapshot.forEach(doc => {
            const data = doc.data();

            //CONVERTING DATE TO STRING
            const addedAt = data.addedAt
                ? data.addedAt.toDate().toLocaleString()
                : "N/A";

            // DISPLAYING DATA TO TABLE
            const row = `
                <tr data-id="${doc.id}">
                    <td>${counter++}</td> 
                    <td><a href="${data.imageUrl}"><img alt="image" src="${
                        data.imageUrl
                    }" class="tableImage border border-secondary border-2"></a></td>
                    <td>${data.category}</td> 
                    <td>${data.productName}</td>
                    <td>${data.size}</td>
                    <td>${addedAt}</td>
                    <td>
                        <button class="btn btn-primary" name="updateBtn">Update</button>
                        <button class="btn btn-danger" name="deleteBtn">Delete</button>
                    </td>
                </tr>
            `;
            table.row.add($(row)).draw();
        });
    }
    displayProducts();

    setTimeout(() => {
        mainView.removeClass("loading");
    }, 900);

    // Cloudinary Widget
    const cloudinaryWidget = cloudinary.createUploadWidget(
        {
            cloudName: "dbtomr3fm",
            uploadPreset: "UPLOAD_IMG",
            sources: ["local", "url", "camera"],
            showAdvancedOptions: false,
            cropping: true,
            multiple: false,
            clientAllowedFormats: ["image/jpeg", "image/png"]
        },
        (error, result) => {
            // ALERT MESSAGE VARIABLES

            // FAILED ALERT MESSAGE
            if (error) {
                console.error("Error:", error);

                alertBox.addClass("alert-danger").removeClass("d-none");
                dangerIcon.removeClass("d-none");
                alertMessage.text("Upload Failed");

                setTimeout(() => {
                    alertBox.addClass("d-none");
                }, 2000);

                return;
            }

            // SUCCESSFUL ALERT MESSAGE
            if (result.event === "success") {
                const imageUrl = result.info.secure_url;

                // IMAGE PREVIEW
                $("#upload-image-preview").attr("src", imageUrl).show();

                // MAKING IT GLOBAL VARIABLE
                window.selectedImageUrl = imageUrl;

                $("#add-img-url").val(imageUrl);

                alertBox.addClass("alert-success").removeClass("d-none");
                successIcon.removeClass("d-none");
                alertMessage.text("Successfully Uploaded");

                setTimeout(() => {
                    alertBox.addClass("d-none");
                }, 2000);
            }
        }
    );
    // Trigger widget on button click
    $("#upload_widget").on("click", function () {
        cloudinaryWidget.open();
    });

    // ADD PRODUCT FUNCTION
    submitProduct.on("click", async function () {
        const category = $("select[name='category']").val();
        const productName = $("input[name='productName']").val();
        const size = $("input[name='size']").val();
        const description = $("textarea[name='description']").val();
        const imageUrl = window.selectedImageUrl || "";

        // FORM INPUT VALIDATION
        if (
            category === "Select Category" ||
            !productName ||
            !size ||
            !description ||
            !imageUrl
        ) {
            alert("Please fill all fields.");
            return;
        }

        const parsedSize = parseInt(size);
        if (isNaN(parsedSize)) {
            alert("Size must be a number.");
            return;
        }

        // ADDING PRODUCT
        try {
            const docRef = await addDoc(collection(chandriaDB, "products"), {
                imageUrl,
                productName,
                category,
                size: parsedSize,
                description,
                addedAt: new Date()
            });

            // SUCCESSFUL ADDING MESSAGE
            alertBox.addClass("alert-success").removeClass("d-none");
            successIcon.removeClass("d-none");
            alertMessage.text("Successfully Added !");

            // MESSAGE TIMEOUT
            setTimeout(() => {
                alertBox.addClass("d-none");
            }, 2000);

            // RESETING FORM INPUTS
            $("select[name='category']").val("Select Category");
            $("input[name='productName']").val("");
            $("input[name='size']").val("");
            $("textarea[name='description']").val("");

            // CLOSING ADD PRODUCT MODAL
            const modal = bootstrap.Modal.getInstance(
                document.getElementById("addProductModal")
            );
            modal.hide();

            displayProducts();
        } catch (e) {
            // FAILED ADDING MESSAGE
            alertBox.addClass("alert-danger").removeClass("d-none");
            dangerIcon.removeClass("d-none");
            alertMessage.text("Cannot Add Product, Failed !");

            setTimeout(() => {
                alertBox.addClass("d-none");
            }, 2000);
            console.log("Error adding Product: " + e.message);
        }
    });

    // UPDATE MODAL DISPLAY DATA
    $("#productsTable tbody").on(
        "click",
        "button[name='updateBtn']",
        function () {
            const docId = $(this).closest("tr").data("id");
            console.log(docId);

            // Fetch the product data from Firestore using the docId
            const docRef = doc(chandriaDB, "products", docId);
            getDoc(docRef)
                .then(doc => {
                    if (doc.exists()) {
                        const productData = doc.data();
                        const {
                            imageUrl,
                            category,
                            productName,
                            size,
                            description,
                            addedAt
                        } = productData;

                        //
                        const dateString = addedAt
                            ? addedAt.toDate().toLocaleString()
                            : "N/A";

                        // IMAGE PREVIEW
                        $("#update-image-preview").attr("src", imageUrl).show();

                        $("#update-doc-id").val(docId);
                        $("#update-category").val(category);
                        $("#update-product-name").val(productName);
                        $("#update-size").val(size);
                        $("#update-description").val(description);
                        $("#showonly-dateAdded").val(dateString);

                        // Open the modal using Bootstrap 5 method
                        const modal = new bootstrap.Modal(
                            document.getElementById("updateProductModal")
                        );
                        modal.show();
                    } else {
                        console.error("No such document!");
                    }
                })
                .catch(error => {
                    console.error("Error getting document:", error);
                });
        }
    );

    // UPDATE SAVE BUTTON FUNCTION
    $("#saveUpdateBtn").on("click", async function () {
        const docId = $("#update-doc-id").val();
        const category = $("#update-category").val();
        const size = parseInt($("#update-size").val());
        const description = $("#update-description").val();
        const productName = $("#update-product-name").val();

        // FORM INPUT VALIDATION
        if (!category || !productName || isNaN(size) || !description) {
            alert("Please fill all fields correctly.");
            return;
        }

        // UPDATE DATA TO DATABASE
        try {
            await updateDoc(doc(chandriaDB, "products", docId), {
                category,
                productName,
                size,
                description
            });

            // SUCCESSFUL UPDATE MESSAGE
            alertBox.addClass("alert-success").removeClass("d-none");
            successIcon.removeClass("d-none");
            alertMessage.text("Successfully Updated !");
            setTimeout(() => {
                alertBox.addClass("d-none");
            }, 2000);
            
            // CLOSE UPDATE MODAL
            const modal = bootstrap.Modal.getInstance(
                document.getElementById("updateProductModal")
            );
            modal.hide();
            displayProducts();

            // UPDATE ERROR
        } catch (e) {
            // FAILED ADDING MESSAGE
            alertBox.addClass("alert-danger").removeClass("d-none");
            dangerIcon.removeClass("d-none");
            alertMessage.text("Cannot Update Product, Failed !");

            setTimeout(() => {
                alertBox.addClass("d-none");
            }, 2000);
            console.log("Error updating product: " + e.message);
        }
    });

    // DELETE DATA FUNCTION
    $("#productsTable tbody").on(
        "click",
        "button[name='deleteBtn']",
        async function () {
            const row = $(this).closest("tr");
            const docId = row.data("id");
            const deleteBtn = $("button[name='deleteBtn']");

            deleteBtn.addClass("disabled").text("Deleting");

            // DELETING DATA
            if (confirm("Are you sure you want to delete this product?")) {
                try {
                    await deleteDoc(doc(chandriaDB, "products", docId));

                    // SUCCESS ALERT MESSAGE
                    alertBox.addClass("alert-success").removeClass("d-none");
                    successIcon.removeClass("d-none");
                    alertMessage.text("Successfully Deleted !");
                    setTimeout(() => {
                        alertBox.addClass("d-none");
                    }, 2000);

                    table.row(row).remove().draw();
                    deleteBtn.removeClass("disabled").text("Delete");
                } catch (error) {
                    alert("Error deleting product: " + error.message);
                }
            }
        }
    );
});
