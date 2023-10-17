import { NextApiRequest, NextApiResponse } from "next";
import { OpenAIStream, OpenAIStreamPayload } from "@/lib/openai-stream";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const message = req.body.messages;
  console.log("Received prompt:", message);
  console.log("OPENAI_API_KEY:", process.env.NEXT_PUBLIC_OPENAI_API_KEY);

  if (!message) {
    res
      .status(400)
      .json({ error: "There was an error with your text, try again!" });
    return;
  }

  try {
    const payload: OpenAIStreamPayload = {
      model: "gpt-3.5-turbo",
      messages: message,
      temperature: 0.4,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 1024,
      stream: true,
      n: 1,
    };

    const stream = await OpenAIStream(payload);

    res.setHeader("Content-Type", "text/plain"); // Ensure the correct header is set

    for await (const chunk of stream as any) {
      res.write(chunk); // Send the chunk to the client immediately
    }

    res.end(); // End the response when all chunks have been processed
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
