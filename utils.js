/**
 * Fetches the currently active tab's URL information
 * @returns {Promise<chrome.tabs.Tab>} Tab object containing URL and metadata
 * 
 * Uses Chrome Tabs API to query active tab in current window
 * Helpful for extensions needing context about current page
 */
export async function getActiveTabURL() {
  // Query Chrome tabs API for active tab in current window
  const tabs = await chrome.tabs.query({
    currentWindow: true,  // Restrict to current browser window
    active: true          // Only return actively viewed tab
  });

  // Return first tab object from results array
  return tabs[0];
}
