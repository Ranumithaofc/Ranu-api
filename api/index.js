module.exports = async (req, res) => {
    // 1. CORS Headers - ඕනෑම වෙබ් අඩවියක සිට ප්‍රවේශ වීමට ඉඩ ලබා දීම
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Browser එකෙන් එවන පූර්ව පරීක්ෂාව (Pre-flight request) සඳහා
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // POST Request එකක් පමණක් බාර ගැනීම
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            status: false, 
            message: 'Only POST requests are allowed on this endpoint.' 
        });
    }

    try {
        const { text } = req.body;
        
        // Input එකක් තිබේදැයි පරීක්ෂා කිරීම
        if (!text) {
            return res.status(400).json({ 
                status: false, 
                reply: "කරුණාකර ප්‍රශ්නයක් හෝ පණිවිඩයක් ඇතුළත් කරන්න." 
            });
        }

        // ඔබේ අලුත්ම API Key එක
        const apiKey = "AIzaSyCLHuXuf3cJNn9BWyZYejX57NyoV7_58iQ";
        
        // Google Gemini 1.5 Flash API Endpoint එක
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // කෙලින්ම API එකට Request එක යැවීම
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ 
                        text: `Your name is Ranumitha-AI. You are a helpful and professional AI assistant developed by Hiruka Ranumitha. Answer this question briefly: ${text}` 
                    }]
                }]
            })
        });

        const data = await response.json();

        // API එකෙන් error එකක් ලැබුණහොත්
        if (data.error) {
            return res.status(500).json({ 
                status: false, 
                reply: "API Error: " + data.error.message 
            });
        }

        // සාර්ථක ප්‍රතිචාරය සකස් කිරීම
        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            
            return res.status(200).json({ 
                status: true, 
                creator: "Hiruka Ranumitha",
                project: "RANUMITHA-X-MD",
                reply: aiReply 
            });
        } else {
            return res.status(500).json({ 
                status: false, 
                reply: "ප්‍රතිචාරය සැකසීමේදී දෝෂයක් සිදුවිය. නැවත උත්සාහ කරන්න." 
            });
        }

    } catch (error) {
        // Server එකේ ඇතිවන දෝෂ සඳහා
        return res.status(500).json({ 
            status: false, 
            reply: "Server Error: " + error.message 
        });
    }
};
