//This is the new amnager for the JudgeGPT UI
//INitially it is only used for the history cases, but perhaps could take over as the main UI Manager in the future
/*class JudgeGPTUIManager
{
	constructor()
	{

	}
}*/

class HistoryManager
{
	constructor()
	{

	}

	LoadPreviousCase()
	{

	}


	LoadNextCase()
	{

	}

	// This function sends a POST request to a server, asking it to generate some text based on a provided input.
	async GetCase(input) {
	    // This will hold a reference to an interval that's set up below.
	    let AskingGPTInterval;

	    // Set up an interval that runs every 250 milliseconds.
	    // The function passed to setInterval is currently empty, so this interval doesn't actually do anything.
	    // You might want to add some code here to update a progress bar or show some other kind of progress indicator.
	    AskingGPTInterval = setInterval(async function() {
	        // Code for progress update could go here.
	    }, 250); 

	    try {
	        console.log("progressInterval = setInterval(async function(){\n try {");
	        // This block of code sends a POST request to a server.
	        // The server is expected to generate some text based on the provided prompt and return it.
	        const response = await fetch('https://brennan.games:3000/GetCase', {
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/json',
	            },
	            body: JSON.stringify({ data: input }),
	        });

	        // Parse the response from the server into a JavaScript object.
	        const res = await response.json();

	        console.log(res);
	        console.log(res.case);

	        // Stop the interval that was set up earlier, as we've received the response we were waiting for.
	        clearInterval(AskingGPTInterval);

	        // Return the generated text from the server.
	        return res;

	    } catch(error) {
	        // If an error occurs while sending the request or parsing the response, log the error to the console.
	        console.error("Error fetching update: ", error);

	        // Stop the interval, as something has gone wrong and we won't be receiving the response we were waiting for.
	        clearInterval(AskingGPTInterval);

	        // Return a default error message.
	        return "Server unresponsive...";
	    }
	}

	// This function sends a POST request to a server, asking it to generate some text based on a provided input.
	async GetCaseMaxID() {
	    // This will hold a reference to an interval that's set up below.
	    let AskingGPTInterval;

	    // Set up an interval that runs every 250 milliseconds.
	    // The function passed to setInterval is currently empty, so this interval doesn't actually do anything.
	    // You might want to add some code here to update a progress bar or show some other kind of progress indicator.
	    AskingGPTInterval = setInterval(async function() {
	        // Code for progress update could go here.
	    }, 250); 

	    try {
	        console.log("progressInterval = setInterval(async function(){\n try {");
	        // This block of code sends a POST request to a server.
	        // The server is expected to generate some text based on the provided prompt and return it.
	        const response = await fetch('https://brennan.games:3000/GetCaseMaxID', {
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/json',
	            },
	        });

	        // Parse the response from the server into a JavaScript object.
	        const res = await response.json();

	        console.log(res);

	        // Stop the interval that was set up earlier, as we've received the response we were waiting for.
	        clearInterval(AskingGPTInterval);

	        // Return the generated text from the server.
	        return res;

	    } catch(error) {
	        // If an error occurs while sending the request or parsing the response, log the error to the console.
	        console.error("Error fetching update: ", error);

	        // Stop the interval, as something has gone wrong and we won't be receiving the response we were waiting for.
	        clearInterval(AskingGPTInterval);

	        // Return a default error message.
	        return "Server unresponsive...";
	    }
	}

}