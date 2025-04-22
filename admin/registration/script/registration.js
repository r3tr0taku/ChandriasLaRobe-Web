import {
    appCredential,
    getAuth,
    createUserWithEmailAndPassword,
    validatePassword,
    sendEmailVerification,
    getFirestore,
    doc,
    setDoc
} from "./chandrias-sdk.js";

const chandriaDB = getFirestore(appCredential);

$(document).ready(function () {
    const notyf = new Notyf({
        position: {
            x: "center",
            y: "top"
        }
    });

    const auth = getAuth(appCredential);

    // BCRYPT VARIABLE
    const bcrypt = window.dcodeIO.bcrypt;

    // VARIABLES
    const $username = $("#input-username");
    const $email = $("#input-email");
    const $password = $("#input-password");
    const $passwordConfirm = $("#confirm-password");
    const signUpBtn = $("#signUp-btn");

    // SIGN-UP BUTTON FUNCTION
    signUpBtn.on("click", async function (e) {
        e.preventDefault();

        // VARIABLES
        const username = $("#input-username").val().trim();
        const email = $("#input-email").val().trim();
        const password = $("#input-password").val().trim();
        const passwordConfirm = $("#confirm-password").val().trim();

        // DISABLING SIGN-UP BUTTON WHEN SIGNING-UP
        signUpBtn.attr("disabled", true).text("Signing Up...");

        if (!username || !email || !password || !passwordConfirm) {
            notyf.error("Please fill in all fields.");
            signUpBtn.attr("disabled", false).text("CREATE AN ACCOUNT");
            return;
        }

        // CONFIRM PASSWORD VALIDATION
        if (password !== passwordConfirm) {
            notyf.error("Passwords do not match.");

            // CLEARING FORM INPUT
            $password.val("");
            $passwordConfirm.val("");

            // ENABLING SIGN-UP BUTTON WHEN WRONG CONFIRM PASSWORD
            signUpBtn.attr("disabled", false).text("CREATE AN ACCOUNT");
            return;
        }

        // PASSWORD VALIDATION
        try {
            const status = await validatePassword(auth, password);
            if (!status.isValid) {
                let errorMsg = `<strong>Password doesn't meet the following requirements:</strong><ul style="padding-left: 20px; margin: 0;">`;

                const minLength =
                    status.passwordPolicy.customStrengthOptions
                        .minPasswordLength;

                if (status.containsLowercaseLetter === false)
                    errorMsg += "<li>At least one lowercase letter</li>";
                if (status.containsUppercaseLetter === false)
                    errorMsg += "<li>At least one uppercase letter</li>";
                if (status.containsNumericCharacter === false)
                    errorMsg += "<li>At least one number</li>";
                if (status.containsNonAlphanumericCharacter === false)
                    errorMsg += "<li>At least one special character</li>";
                if (minLength && password.length < minLength)
                    errorMsg += `<li>Minimum length: ${minLength} characters</li>`;

                console.log(`Minimum length required: ${minLength}`);

                errorMsg += "</ul>";

                notyf.open({
                    type: "error",
                    message: errorMsg,
                    duration: 5000
                });

                // ENABLING SIGN-UP BUTTON WHEN WRONG VALIDATION
                signUpBtn.attr("disabled", false).text("CREATE AN ACCOUNT");
                return;
            }

            // REGISTERING IF SUCCESS
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // SEND VERIFICATION EMAIL
            await sendEmailVerification(userCredential.user);

            // SAVE USER INFO TO FIRESTORE
            const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

            await setDoc(doc(chandriaDB, "users", userCredential.user.uid), {
                username: username,
                email: email,
                password: hashedPassword,
                createdAt: new Date()
            });

            // MESSAGE IF SUCCESS
            notyf.open({
                type: "success",
                message:
                    "Successfully Signed-Up! Now Check Email for Verification!",
                duration: 5000
            });

            // SIGN OUT user so they must log in manually
            await getAuth().signOut();

            // CLEARING FORM INPUTS
            $username.val("");
            $email.val("");
            $password.val("");
            $passwordConfirm.val("");

            // ERROR IF FAILED
        } catch (error) {
            console.error(error.code, error.message);
        }

        // ENABLING SIGN-UP BUTTON AFTER SUCCESS REGISTERING
        signUpBtn.attr("disabled", false).text("CREATE AN ACCOUNT");
    });

    // TOGGLING PASSWORD
    $("#togglePassword").click(function () {
        const input = $("#input-password");
        const type = input.attr("type") === "password" ? "text" : "password";
        input.attr("type", type);
        $(this).toggleClass("bx-show bx-hide");
    });

    $("#toggleConfirmPassword").click(function () {
        const input = $("#confirm-password");
        const type = input.attr("type") === "password" ? "text" : "password";
        input.attr("type", type);
        $(this).toggleClass("bx-show bx-hide");
    });
});
