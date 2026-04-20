/* Nexus AI — Backend Server
   Author: Adonis
   License: Boost Software License 1.0
   Description: Handles secure API requests to Groq (Llama 3 8.1B Instant) and serves frontend files.
*/

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config(); // Loads environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("public")); // optional if you move frontend files to /public

// Securely load API key from environment variable
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Endpoint for chat requests
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8.1b-instant",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || "No response received.";

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Error communicating with Groq API:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Serve index.html if needed
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Nexus AI server running on http://localhost:${PORT}`);
});
