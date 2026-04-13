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
        
        // අලුත්ම සහ වඩාත්ම ස්ථාවර Endpoint එක (Gemini 2.0 Flash)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Your name is Ranumitha-AI, created by Hiruka Ranumitha. Answer this: ${text}` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // Error එකක් ආවොත් ඒක UI එකේ පෙන්වන්න
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
            return res.status(500).json({ status: false, reply: "නොදන්නා දෝෂයක් සිදුවිය." });
        }

    } catch (error) {
        return res.status(500).json({ 
            status: false, 
            reply: "Server Error: " + error.message 
        });
    }
};
