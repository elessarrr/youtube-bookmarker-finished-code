import { getActiveTabURL } from "./utils.js";

// Creates new bookmark DOM element
const addNewBookmark = (bookmarks, bookmark) => {
  // Create DOM elements
  const bookmarkTitleElement = document.createElement("div");
  const controlsElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");

  // Configure title element
  bookmarkTitleElement.textContent = bookmark.desc;
  bookmarkTitleElement.className = "bookmark-title";
  
  // Set up controls container
  controlsElement.className = "bookmark-controls";
  
  // Add action buttons
  setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);

  // Configure parent bookmark element
  newBookmarkElement.id = `bookmark-${bookmark.time}`;
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time);
  
  // Assemble DOM structure
  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controlsElement);
  bookmarks.appendChild(newBookmarkElement);
};

// Renders all bookmarks in popup
const viewBookmarks = (currentBookmarks = []) => {
  const bookmarksElement = document.getElementById("bookmarks");
  bookmarksElement.innerHTML = ""; // Clear existing content

  if (currentBookmarks.length > 0) {
    currentBookmarks.forEach(bookmark => {
      addNewBookmark(bookmarksElement, bookmark);
    });
  } else {
    bookmarksElement.innerHTML = '<i>No bookmarks to show</i>';
  }
};

// Handles play bookmark action
const onPlay = async e => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getActiveTabURL();
  
  // Send message to content script
  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  });
};

// Handles bookmark deletion
const onDelete = async e => {
  const activeTab = await getActiveTabURL();
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const bookmarkElementToDelete = document.getElementById(
    `bookmark-${bookmarkTime}`
  );

  // Remove from DOM
  bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);
  
  // Update storage and re-render
  chrome.tabs.sendMessage(activeTab.id, {
    type: "DELETE",
    value: bookmarkTime,
  }, viewBookmarks);
};

// Creates control buttons with consistent attributes
const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");
  controlElement.src = `assets/${src}.png`;
  controlElement.title = src; // Accessibility tooltip
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

// Initialization when DOM loads
document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);
  const currentVideo = urlParameters.get("v");

  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo] ? 
        JSON.parse(data[currentVideo]) : [];
      viewBookmarks(currentVideoBookmarks);
    });
  } else {
    // Show error state
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = '<div class="title">This is not a YouTube video page.</div>';
  }
});
