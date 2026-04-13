const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());

// 🔑 Put your API key here
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCLHuXuf3cJNn9BWyZYejX57NyoV7_58iQ");

// ✅ Correct model name
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest"
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ error: "Message required" });
    }

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (err) {
    console.error(err);
    res.json({
      error: "API Error",
      details: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
