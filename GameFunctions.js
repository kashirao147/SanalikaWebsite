
       const titleId = "26FF3";  // Replace with your PlayFab Title ID
       const apiUrl = `https://${titleId}.playfabapi.com`;  // Base API URL for PlayFab

       // Function to get account info using REST API
       async function getAccountInfo() {
           const sessionTicket = getCookie('playfabSessionTicket');
           if (!sessionTicket) {
               alert("Session expired or not available. Please log in again.");
               window.location.href = "index.html";
               return;
           }

           const url = `${apiUrl}/Client/GetAccountInfo`;
           const headers = {
               'Content-Type': 'application/json',
               'X-Authorization': sessionTicket  // Set the session ticket in the request header
           };

           const body = JSON.stringify({});

           try {
               const response = await fetch(url, {
                   method: 'POST',
                   headers: headers,
                   body: body
               });

               const data = await response.json();

               if (response.ok) {
                   console.log("Account Info Retrieved: ", data);

                   
                   // Handle account info
               } else {
                   console.error("Error retrieving account info: ", data);

                   if (data.errorMessage === "NotAuthorized" || data.code === 401) {
                       alert("Your session has expired or is invalid. Please log in again.");
                      
                       window.location.href = "index.html";  // Redirect to login page
                   } else {
                       alert("An error occurred: " + data.errorMessage);
                   }
               }
           } catch (error) {
               console.error("An error occurred: ", error);
               alert("An error occurred while contacting the server.");
           }
       }

       window.onload = function () {
           const sessionTicket = getCookie('playfabSessionTicket');

           if (sessionTicket) {
               console.log("Session Ticket Retrieved from Cookie: ", sessionTicket);
               // Proceed with API calls now that the session ticket is set
               getAccountInfo();
           } else {
               alert('Session has expired or you are not logged in. Please log in again.');
               window.location.href = "index.html";  // Redirect to login page
           }
       };

       function logout() {
           document.cookie = "playfabSessionTicket=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
           window.location.href = "index.html"; // Redirect to login page after logout
       }

       // Function to get a cookie by name
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





       async function getEmail() {
           const sessionTicket = getCookie('playfabSessionTicket');
           if (!sessionTicket) {
               alert("Session expired or not available. Please log in again.");
               window.location.href = "index.html";
               return;
           }

           const url = `https://26FF3.playfabapi.com/Client/GetAccountInfo`;
           const headers = {
               'Content-Type': 'application/json',
               'X-Authorization': sessionTicket  // Set the session ticket in the request header
           };

           try {
               const response = await fetch(url, {
                   method: 'POST',
                   headers: headers,
                   body: JSON.stringify({})
               });

               const data = await response.json();

               if (response.ok) {
                   console.log("Account Info Retrieved: ", data);

                   // Extract the player's email from the account info
                   const playerEmail = data.data.AccountInfo.PrivateInfo.Email;

                   if (playerEmail) {
                       console.log("Sending player email to Unity: ", playerEmail);
                       sendEmailToUnity(playerEmail); // Call the function to send the email to Unity
                   } else {
                       console.log("Email not found.");
                   }

               } else {
                   console.error("Error retrieving account info: ", data);
                   alert("An error occurred while retrieving account info.");
               }
           } catch (error) {
               console.error("An error occurred: ", error);
               alert("An error occurred while contacting the server.");
           }
       }

       // Function to send the player's email to Unity
       function sendEmailToUnity(email) {
           // Change 'GameObjectName' to the actual name of the GameObject in Unity
           // Change 'ReceiveEmail' to the actual method name in the Unity script
           if (unityInstance) {
               unityInstance.SendMessage('GameObjectName', 'ReceiveEmail', email);
           } else {
               console.error("Unity instance not found.");
           }
       }

   