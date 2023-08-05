// Set a cookie
function setCookie(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    var expires = "expires="+ date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
    console.log("setcookie");
    console.log(document.cookie);
}

// Set a session cookie
function setSessionCookie(name, value) {

    // Convert the value into a JSON string if it's an object
    if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
    }

    document.cookie = name + "=" + value + ";path=/";
}

// Get a cookie
function getCookie(name) {
    var name = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    console.log("getCookie");
    console.log(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            var cookieValue = c.substring(name.length, c.length);

            // Try to parse the cookie value as JSON
            try {
                return JSON.parse(cookieValue);
            } catch (error) {
                // If it fails to parse as JSON, return the value as is
                console.log("Failed to parse cookie value as JSON. Returning as is.");
                return cookieValue;
            }
        }
    }
    return "";
}


// Check if a cookie exists
function checkCookie(name) {
    var value = getCookie(name);
    if (value != "") {
        alert("Welcome back! Your ClientID is " + value);
    } else {
        value = prompt("Please enter your ClientID:", "");
        if (value != "" && value != null) {
            setCookie(name, value, 1);  // Set the cookie to expire in 1 day
        }
    }
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}


// Use the cookie functions
//checkCookie("ClientID");
