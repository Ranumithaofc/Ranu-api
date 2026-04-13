const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST allowed' });
    }

    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ reply: "Please provide some text." });

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Model එක මෙතනින් "gemini-pro" ලෙස වෙනස් කර බලන්න
        const model = genAI.getGenerativeModel({ 
            model: "gemini-pro"
        });

        // System Instruction එක මේ ආකාරයට ලබා දීම වඩාත් ආරක්ෂිතයි
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Your name is Ranumitha-AI. You are a professional assistant created by Ranumitha. Always keep this identity." }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am Ranumitha-AI, created by Ranumitha. How can I help you today?" }],
                },
            ],
        });

        const result = await chat.sendMessage(text);
        const response = await result.response;
        const output = response.text();
        
        return res.status(200).json({ status: true, reply: output });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, reply: "AI Error: " + error.message });
    }
};
