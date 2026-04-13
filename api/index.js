const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
    // CORS errors මඟහරවා ගැනීමට
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Send a POST request with "text" in the body.' });
    }

    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ reply: "Please provide some text." });

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Your name is Ranumitha-AI, created by Ranumitha."
        });

        const result = await model.generateContent(text);
        const response = await result.response;
        const output = response.text();
        
        return res.status(200).json({ status: true, reply: output });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, reply: "AI Error: " + error.message });
    }
};
