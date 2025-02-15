chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetch_quote") {
      fetch("https://api.api-ninjas.com/v1/quotes?category=inspirational", {
        headers: { "X-Api-Key": "YOUR_API_KEY_HERE" }, // Replace with your API key
      })
        .then((response) => response.json())
        .then((data) => {
          sendResponse({ quote: data[0].quote, author: data[0].author });
        })
        .catch((error) => {
          console.error("Error fetching quote:", error);
          sendResponse({ quote: "Failed to load quote.", author: "" });
        });
  
      return true; // Required to send response asynchronously
    }
  });
  