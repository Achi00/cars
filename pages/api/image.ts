// import { Configuration, OpenAIApi } from "openai";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt is required" });
//     }

//     const response = await openai.createImage({
//       prompt: prompt,
//       n: 1,
//       size: "512x512",
//     });

//     return res.status(200).json({ data: response.data.data });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }
