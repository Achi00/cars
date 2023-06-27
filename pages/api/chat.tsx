import { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prompt = req.body.prompt;
  console.log('Received prompt:', prompt);
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

  if (!prompt) {
    res.status(400).json({ error: 'There was an error with your text, try again!' });
    return;
  }

  try {
    const chatResponse = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 2048,
      temperature: 0.5,
    });

    const response = chatResponse.data.choices[0].text?.trim() || "I'm offline, try again later";
    res.status(200).json({ answer: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred.' });
  }
}
