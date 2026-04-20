/* Nexus AI — Frontend Logic
   Author: Adonis
   License: Boost Software License 1.0
   Description: Handles chat UI and communication with server.js (no API key stored here)
*/

const chatContainer = document.createElement("div");
chatContainer.id = "chat-container";
document.body.appendChild(chatContainer);

const inputBox = document.createElement("input");
inputBox.type = "text";
inputBox.placeholder = "Ask Nexus AI...";
inputBox.id = "user-input";
document.body.appendChild(inputBox);

const sendButton = document.createElement("button");
sendButton.textContent = "Send";
document.body.appendChild(sendButton);

const loadingIndicator = document.createElement("p");
loadingIndicator.textContent = "";
document.body.appendChild(loadingIndicator);

// Function to display messages
function displayMessage(sender, text) {
  const message = document.createElement("div");
  message.className = sender === "user" ? "user-message" : "ai-message";
  message.textContent = text;
  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Function to send message to server.js
async function sendMessage() {
  const userMessage = inputBox.value.trim();
  if (!userMessage) return;

  displayMessage("user", userMessage);
  inputBox.value = "";
  loadingIndicator.textContent = "Nexus AI is thinking...";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    displayMessage("ai", data.reply || "No response received.");
  } catch (error) {
    displayMessage("ai", "Error connecting to server.js. Check console for details.");
    console.error("Error:", error);
  } finally {
    loadingIndicator.textContent = "";
  }
}

sendButton.addEventListener("click", sendMessage);
inputBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Optional: welcome message
displayMessage("ai", "Hello Adonis 👋 — Nexus AI is online and ready to chat!");
