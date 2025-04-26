import {
  appCredential,
  getFirestore,
  collection,
  addDoc
} from "./chandrias-sdk.js";

$(document).ready(function () {
  $("#place-rent-btn").on("click", async function (e) {
      e.preventDefault();

      const notyf = new Notyf({
        position: {
            x: "center",
            y: "top"
        }
    });

      const chandriaDB = getFirestore(appCredential);
      const checkoutStatus = "Upcoming";

      try {
          // GET FORM DATA
          const productData = {
              customerName: $("#customer-name").val(),
              customerEmail: $("#customer-email").val(),
              checkoutDate: $("#checkout-date").val(),
              checkoutTime: $("#checkout-time").val(),
              checkoutStatus: checkoutStatus,
              createdAt: new Date()
          };

          // SAVE TO FIREBASE
          const docRef = await addDoc(
              collection(chandriaDB, "appointments"),
              productData
          );

          notyf.success("Checkout successful! Your appointment has been saved.");

          // RESET FORM
          $("form")[0].reset();
      } catch (err) {
          console.error("Upload failed:", err);
          showErrorModal("There was an error uploading the product.");
      }
  });
});
