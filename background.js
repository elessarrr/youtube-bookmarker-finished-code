// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, tab) => {
  // Only trigger for YouTube watch pages
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    // Parse URL parameters
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    
    // Send video ID to content script
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParameters.get("v"), // Extract YouTube video ID
    });
  }
});
