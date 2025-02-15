// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, tab) => {    // Listen for an update to tabs
  // Only trigger for YouTube watch pages
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    // Parse URL parameters
    const queryParameters = tab.url.split("?")[1];            // unique id for each video
    const urlParameters = new URLSearchParams(queryParameters); //just an interface to work with URLs
    
    // Send video ID to content script "hey a new video has loaded; this is the ID"
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParameters.get("v"), // Extract YouTube video ID
    });
  }
});
