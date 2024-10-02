// PlayFab Title ID
const titleId = "26FF3";  // Replace with your actual PlayFab Title ID
const apiUrl = `https://${titleId}.playfabapi.com/Client/LoginWithEmailAddress`;  // PlayFab API URL

// Function to handle login with email and password using REST API
async function loginWithEmail() {
    // Get the input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginButton = document.querySelector('.login-button');

    // Validate inputs
    if (!email || !validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address.');
        return;
    }

    if (!password || password.length < 8) {
        showError('passwordError', 'Password must be at least 8 characters long.');
        return;
    }

    // Clear previous error messages
    hideError('emailError');
    hideError('passwordError');

    // Disable the login button to prevent multiple requests
    loginButton.disabled = true;
    loginButton.innerText = "Logging in..."; // Optionally, change the button text

    // Create the login request body
    const loginRequest = {
        TitleId: titleId,  // Required
        Email: email,
        Password: password
    };

    try {
        // Make the API call using fetch
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginRequest)
        });

        const data = await response.json();

        // Re-enable the login button once the response is received
        loginButton.disabled = false;
        loginButton.innerText = "LOGIN";  // Reset the button text

        if (response.ok && data.data && data.data.SessionTicket) {
            console.log("PlayFab login successful: ", data);

            // Store session ticket in a cookie
            setCookie('playfabSessionTicket', data.data.SessionTicket, 1); // Cookie expires in 1 day

            // Redirect to dashboard after successful login
             window.location.href = "dashboard.html"; // Change this to the URL of the page you want to redirect to
        } else {
            // If the response indicates an error
            console.log("PlayFab login failed: ", data);
            showError('emailError', 'Email or password is incorrect.');
        }
    } catch (error) {
        console.error("An error occurred during login: ", error);
        showError('emailError', 'An error occurred while logging in.');
    }
}

// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Set cookie expiration in days
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/"; // Set cookie for the entire domain
}


function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}




// Utility functions for showing and hiding error messages
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.innerText = message;
    errorElement.style.display = 'block';
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.style.display = 'none';
}

// Email validation function
function validateEmail(email) {
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    return emailPattern.test(email);
}















//Login with Google




    var client;
    var access_token;

    // Initialize the Google OAuth client when the page loads
    window.onload = function () {
        initGoogleClient();
    };

    function initGoogleClient() {
        console.log("Initializing Google token client.");
        client = google.accounts.oauth2.initTokenClient({
            client_id: "501980567799-jnjeakr4f8srmgum5d86f6vo8l98r1uo.apps.googleusercontent.com", // Replace with your Google client ID
            scope: "https://www.googleapis.com/auth/userinfo.profile",
            callback: (tokenResponse) => {
                access_token = tokenResponse.access_token;
                onGoogleSignIn();  // Authenticate with PlayFab after successful Google login
            }
        });
    }

    // Trigger Google sign-in when the player clicks on the Google icon
    function getToken() {
        client.requestAccessToken();
    }

    // Authenticate the user with PlayFab using the Google Access Token

// Authenticate the user with PlayFab using the Google Access Token (REST API)
async function onGoogleSignIn() {
    console.log("Google sign-in successful, attempting PlayFab login.");

    const loginRequest = {
        TitleId: "26FF3",  // Your PlayFab Title ID
        AccessToken: access_token,
        CreateAccount: true  // Create an account if it doesn't exist
    };

    try {
        // Make a POST request to PlayFab's REST API
        const response = await fetch("https://26FF3.playfabapi.com/Client/LoginWithGoogleAccount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginRequest)
        });

        const data = await response.json();

        if (response.ok && data.data && data.data.SessionTicket) {
            console.log("PlayFab login successful: ", data);

            // Store session ticket in a cookie for further use
            setCookie('playfabSessionTicket', data.data.SessionTicket, 1); // Cookie expires in 1 day

            // Redirect to the dashboard
            window.location.href = "dashboard.html";  // Replace with the path to your dashboard
        } else {
            console.error("PlayFab login failed: ", data);
            alert("PlayFab login failed. Please try again.");
        }
    } catch (error) {
        console.error("An error occurred during the PlayFab login: ", error);
        alert("An error occurred. Please try again.");
    }
}
















// Function to open Create Account popup and hide error messages
document.getElementById("openPopup").onclick = function () {
    document.getElementById("popupForm").style.display = "flex";

    // Hide error messages
    document.getElementById("createAccountEmailError").style.display = 'none';
    document.getElementById("createAccountPasswordError").style.display = 'none';

    // Clear inputs (optional)
    document.getElementById("createAccountEmail").value = '';
    document.getElementById("createAccountPassword").value = '';
};
document.getElementById("closePopup").onclick = function () {
    document.getElementById("popupForm").style.display = "none";
};

// Function to open Forgot Password popup and hide error messages
document.getElementById("openForgotPasswordPopup").onclick = function () {
    document.getElementById("forgotPasswordPopup").style.display = "flex";

    // Hide error message
    document.getElementById("forgotPasswordEmailError").style.display = 'none';

    // Clear input (optional)
    document.getElementById("forgotPasswordEmail").value = '';
};
document.getElementById("closeForgotPasswordPopup").onclick = function () {
    document.getElementById("forgotPasswordPopup").style.display = "none";
};







// JavaScript to handle showing and hiding the error messages
document.getElementById('email').addEventListener('blur', function () {
    const email = this.value;
    const emailError = document.getElementById('emailError');

    // Simple email validation pattern
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (!email.match(emailPattern)) {
        emailError.style.display = 'block';
        setTimeout(() => {
            emailError.style.display = 'none';
        }, 2000); // Hide after 2 seconds
    }
});

document.getElementById('password').addEventListener('blur', function () {
    const password = this.value;
    const passwordError = document.getElementById('passwordError');

    // Password validation - at least 8 characters
    if (password.length < 8) {
        passwordError.style.display = 'block';
        setTimeout(() => {
            passwordError.style.display = 'none';
        }, 2000); // Hide after 2 seconds
    }
});






// JavaScript for showing and hiding the error messages in Create Account popup

document.getElementById('createAccountEmail').addEventListener('blur', function () {
    const email = this.value;
    const emailError = document.getElementById('createAccountEmailError');

    // Simple email validation pattern
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (!email.match(emailPattern)) {
        emailError.style.display = 'block';
        setTimeout(() => {
            emailError.style.display = 'none';
        }, 2000); // Hide after 2 seconds
    }
});

document.getElementById('createAccountPassword').addEventListener('blur', function () {
    const password = this.value;
    const passwordError = document.getElementById('createAccountPasswordError');

    // Password validation - at least 8 characters
    if (password.length < 8) {
        passwordError.style.display = 'block';
        setTimeout(() => {
            passwordError.style.display = 'none';
        }, 2000); // Hide after 2 seconds
    }
});





// JavaScript for showing and hiding the error messages in Forgot Password popup

document.getElementById('forgotPasswordEmail').addEventListener('blur', function () {
    const email = this.value;
    const emailError = document.getElementById('forgotPasswordEmailError');

    // Simple email validation pattern
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (!email.match(emailPattern)) {
        emailError.style.display = 'block';
        setTimeout(() => {
            emailError.style.display = 'none';
        }, 2000); // Hide after 2 seconds
    }
});


















//Recovery email

document.getElementById('forgotPasswordForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const email = document.getElementById('forgotPasswordEmail').value;
    const emailErrorElement = document.getElementById('forgotPasswordEmailError');

    // Simple email validation
    if (!validateEmail(email)) {
        showError('forgotPasswordEmailError', 'Please enter a valid email address.');
        return;
    }

    // Hide any previous error message
    hideError('forgotPasswordEmailError');

    // Prepare the request payload
    const recoveryRequest = {
        TitleId: "26FF3",  // Replace with your actual PlayFab Title ID
        Email: email,
    };

    try {
        // Make the POST request to PlayFab's password recovery endpoint
        const response = await fetch("https://26FF3.playfabapi.com/Client/SendAccountRecoveryEmail", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recoveryRequest)
        });

        const data = await response.json();

        if (response.ok && data.data) {
            // Success response handling
            console.log("Password recovery email sent: ", data);
            showSuccessMessage('Password recovery email sent. Please check your inbox.');
        } else {
            // Error response handling
            console.error("Password recovery failed: ", data);
            showError('forgotPasswordEmailError', data.errorMessage || 'An error occurred while sending the recovery email.');
        }
    } catch (error) {
        console.error("An error occurred: ", error);
        showError('forgotPasswordEmailError', 'An error occurred while sending the recovery email.');
    }
});





// Utility function to show a success message
function showSuccessMessage(message) {
    const successElement = document.getElementById('forgotPasswordEmailError');
    successElement.innerText = message;
    
    successElement.style.display = 'block';
}







































//Signup with email and password



document.getElementById('createAccountForm').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent the default form submission

    const email = document.getElementById('createAccountEmail').value;
    const password = document.getElementById('createAccountPassword').value;
    const statusMessageElement = document.getElementById('createAccountStatusMessage');

    // Validate email
    if (!validateEmail(email)) {
        showError('createAccountEmailError', 'Please enter a valid email address.');
        return;
    }

    // Validate password
    if (password.length < 8) {
        showError('createAccountPasswordError', 'Password must be at least 8 characters long.');
        return;
    }

    // Hide any previous error messages
    hideError('createAccountEmailError');
    hideError('createAccountPasswordError');

    // Prepare the request payload for the PlayFab API
    const signUpRequest = {
        TitleId: "26FF3",  // Replace with your PlayFab Title ID
        Email: email,
        Password: password,
        RequireBothUsernameAndEmail: false  // Depends on your PlayFab settings
    };

    try {
        // Make the POST request to PlayFab's sign-up endpoint
        const response = await fetch("https://26FF3.playfabapi.com/Client/RegisterPlayFabUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signUpRequest)
        });

        const data = await response.json();

        if (response.ok && data.data) {
            // Success: Show success message, close the popup, and hide after 2 seconds
            showStatusMessage('Account created successfully!', true);
            closeCreateAccountPopup();
        } else {
            // Failure: Show error message
            showStatusMessage(data.errorMessage || 'Failed to create account. Please try again.', false);
        }
    } catch (error) {
        // Error: Show error message
        console.error("An error occurred during account creation:", error);
        showStatusMessage('An error occurred. Please try again.', false);
    }
});



// Utility function to show success or error status messages
function showStatusMessage(message, isSuccess) {
    const statusMessageElement = document.getElementById('createAccountStatusMessage');
    statusMessageElement.innerText = message;
    statusMessageElement.style.display = 'block';
    statusMessageElement.style.backgroundColor = isSuccess ? '#28a745' : '#dc3545';  // Green for success, red for error
    statusMessageElement.style.color = '#fff';
    statusMessageElement.style.padding = '10px';
    statusMessageElement.style.marginTop = '15px';
    statusMessageElement.style.borderRadius = '5px';
    statusMessageElement.style.textAlign = 'center';

    // Hide the status message after 2 seconds
    setTimeout(() => {
        statusMessageElement.style.display = 'none';
    }, 2000);
}

// Function to close the popup after successful signup
function closeCreateAccountPopup() {
    const popup = document.getElementById('popupForm');
    popup.style.display = 'none';
}

