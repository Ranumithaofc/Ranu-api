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

        const apiKey = "AIzaSyCU-BKB-THuDnW3I92QRXQm5sQShkJ140E";
        // කෙලින්ම Google API එකට Request එක යවන URL එක
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Your name is Ranumitha-AI. You are a professional assistant created by Hiruka Ranumitha. Question: ${text}` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ status: false, reply: "API Error: " + data.error.message });
        }

        const aiReply = data.candidates[0].content.parts[0].text;
        
        return res.status(200).json({ 
            status: true, 
            creator: "Ranumitha",
            reply: aiReply 
        });

    } catch (error) {
        return res.status(500).json({ 
            status: false, 
            reply: "Server Error: " + error.message 
        });
    }
};
