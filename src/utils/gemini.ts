const GEMINI_API_KEY = 'AIzaSyB53slGEu35yDYOKoAEJRWZ2DbgkrZx9qI';
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export interface GeminiResponse {
  answer: string;
  error?: string;
}

export const askGemini = async (passage: string, question: string, choices?: string): Promise<GeminiResponse> => {
  try {
    const prompt = `I am going to ask you some questions about this text. Please make your answers as short as possible. If the answer is not in the story please answer "Not In Story":

${passage}

Question: ${question}${choices ? `\nChoices: ${choices}` : ''}`;

    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get response from Gemini');
    }

    const answer = data.candidates[0].content.parts[0].text;
    return { answer };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      answer: '',
      error: error instanceof Error ? error.message : 'Failed to get response from AI'
    };
  }
}; 