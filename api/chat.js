import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });

  } catch (err) {
    res.status(500).json({
      error: "API Error",
      details: err.message
    });
  }
}
