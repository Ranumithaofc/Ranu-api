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
        if (!text) return res.status(400).json({ reply: "ප්‍රශ්නයක් ඇතුළත් කරන්න." });

        const apiKey = "AIzaSyCU-BKB-THuDnW3I92QRXQm5sQShkJ140E";
        
        // මෙහිදී අපි v1 version එක සහ gemini-pro මාදිලිය භාවිතා කරමු
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `You are Ranumitha-AI, a professional assistant created by Hiruka Ranumitha. Answer: ${text}` }]
                }]
            })
        });

        const data = await response.json();

        // Error එකක් ආවොත් ඒක හරියටම බලාගන්න මේක උදව් වෙනවා
        if (data.error) {
            return res.status(500).json({ status: false, reply: "API Error: " + data.error.message });
        }

        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ 
                status: true, 
                creator: "Ranumitha",
                reply: aiReply 
            });
        } else {
            return res.status(500).json({ status: false, reply: "Unexpected API response format." });
        }

    } catch (error) {
        return res.status(500).json({ 
            status: false, 
            reply: "Server Error: " + error.message 
        });
    }
};
