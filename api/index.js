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

        // ඔබේ API Key එක මෙතනට කෙලින්ම ලබා දෙන්න
        const API_KEY = "AIzaSyCU-BKB-THuDnW3I92QRXQm5sQShkJ140E"; 
        const genAI = new GoogleGenerativeAI(API_KEY);
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(`Your name is Ranumitha-AI. Creator: Ranumitha. Answer: ${text}`);
        const response = await result.response;
        
        res.status(200).json({ status: true, reply: response.text() });

    } catch (error) {
        res.status(500).json({ status: false, reply: "AI Error: " + error.message });
    }
};
