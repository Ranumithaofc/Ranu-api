const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
    // CORS Settings
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
        if (!text) return res.status(400).json({ reply: "ප්‍රශ්නයක් ඇතුළත් කරන්න." });

        // ඔබ ලබාදුන් API Key එක
        const genAI = new GoogleGenerativeAI("AIzaSyCU-BKB-THuDnW3I92QRXQm5sQShkJ140E");
        
        // වඩාත්ම ස්ථාවර Model එක
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Your name is Ranumitha-AI. You are a helpful AI assistant developed by Hiruka Ranumitha. Answer this: ${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const output = response.text();
        
        return res.status(200).json({ 
            status: true, 
            creator: "Ranumitha",
            reply: output 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            status: false, 
            reply: "AI Error: " + error.message 
        });
    }
};
