const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
    // POST request එකක් නෙමෙයි නම් error එකක් යවන්න
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    try {
        const { text } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Your name is Ranumitha-AI. You are a helpful assistant created by Ranumitha."
        });

        const result = await model.generateContent(text);
        const response = await result.response;
        
        res.status(200).json({
            status: true,
            creator: "Ranumitha",
            reply: response.text()
        });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
};
