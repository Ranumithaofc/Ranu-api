const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST allowed' });
    }

    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ reply: "Please send a message." });

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Gemini Pro Latest සඳහා නිවැරදි මාදිලිය
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const result = await model.generateContent(`Your name is Ranumitha-AI. You are a professional assistant created by Ranumitha. Answer: ${text}`);
        const response = await result.response;
        
        res.status(200).json({ status: true, reply: response.text() });

    } catch (error) {
        res.status(500).json({ status: false, reply: "AI Error: " + error.message });
    }
};
