const axios = require("axios");

module.exports = async (req, res) => {
    try {
        const msg = req.body.message;

        if (!msg) {
            return res.status(400).json({ error: "Message required" });
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
Friendly Sinhala + English assistant
Created by Ranumitha
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

        res.status(200).json({
            bot: "Ranumitha AI",
            reply: response.data.choices[0].message.content
        });

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};
