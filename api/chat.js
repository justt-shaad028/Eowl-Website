// This tells Vercel this is a serverless function, not a website
export const config = {
  runtime: 'edge',
};

// This is the AI model we'll use (a free, fast grammar corrector)
const MODEL_API_URL = 'https://api-inference.huggingface.co/models/pszemraj/flan-t5-large-grammar-synthesis';
// This is the main function that runs when your chatbot "calls" it
export default async function handler(request) {
  
  // 1. Get the user's sentence from the chatbot request
  const { sentence } = await request.json();

  if (!sentence) {
    return new Response(JSON.stringify({ error: 'No sentence provided' }), { status: 400 });
  }

  // 2. Securely get your secret API key from Vercel's "Environment Variables"
  //    process.env.HF_TOKEN is the key we saved in the Vercel settings
  const HUGGINGFACE_TOKEN = process.env.HF_TOKEN;

  if (!HUGGINGFACE_TOKEN) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
  }

  try {
    // 3. Call the Hugging Face AI "brain"
    const response = await fetch(
      MODEL_API_URL,
      {
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: `grammar: ${sentence}`,
        }),
      }
    );

    if (!response.ok) {
      // If the AI model itself has an error
      const errorText = await response.text();
      console.error('Hugging Face API Error:', errorText);
      return new Response(JSON.stringify({ error: 'AI model failed', details: errorText }), { status: 502 });
    }

    // 4. Get the AI's answer
    const result = await response.json();
    
    // The model returns an array, we want the first item's text
    const correctedText = result[0]?.generated_text;

    if (!correctedText) {
      return new Response(JSON.stringify({ error: 'AI gave an empty response' }), { status: 500 });
    }
    
    // 5. Send the corrected sentence back to your chatbot!
    return new Response(
      JSON.stringify({
        corrected: correctedText,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Server-side error:', error);
    return new Response(JSON.stringify({ error: 'An internal error occurred' }), { status: 500 });
  }
}