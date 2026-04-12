const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

// 🔥 Ranumitha AI API
app.post("/ranumitha", async (req, res) => {
    try {
        const msg = req.body.message;

        if (!msg) {
            return res.json({ error: "Message required" });
        }

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `
You are Ranumitha AI 🤖
- Friendly Sinhala + English mix
- Helpful assistant
- Created by Ranumitha
                        `
                    },
                    {
                        role: "user",
                        content: msg
                    }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({
            bot: "Ranumitha AI",
            reply: response.data.choices[0].message.content
        });

    } catch (err) {
        console.log(err.message);
        res.json({ error: "Server error" });
    }
});

// 🔥 PORT
app.listen(process.env.PORT || 3000, () => {
    console.log("Ranumitha AI running...");
});
