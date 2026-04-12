const axios = require("axios");

module.exports = async (req, res) => {
    try {
        let body = req.body;
        if (typeof body === "string") body = JSON.parse(body || "{}");

        const msg = body?.message;

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
                        content: "You are Ranumitha AI 🤖 friendly Sinhala assistant"
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
        res.status(500).json({ error: "Server error" });
    }
};
