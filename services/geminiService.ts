import { GoogleGenAI, Type } from "@google/genai";
import type { ChatMessage, HealthcareProvider, GroundingChunk } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chatModel = 'gemini-2.5-flash';

const chatSystemInstruction = `You are an AI Healthcare Bot. Your purpose is to provide helpful, general health-related information and precautions. 
You must not provide medical advice, diagnoses, or treatment plans. You are not a substitute for a real doctor.
Always advise users to consult a qualified healthcare professional for any medical concerns. 
Keep your answers concise, clear, and easy to understand for a general audience.
Do not ask for personally identifiable information (PII) like names, addresses, or medical history.`;

export const getChatbotResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: chatModel,
      config: {
        systemInstruction: chatSystemInstruction,
      },
      history: history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text;
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return "I'm sorry, but I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
};

export const findNearbyHealthcare = async (
  location: string, 
  type: 'doctor/clinic' | 'hospital'
): Promise<{ providers: HealthcareProvider[], sources: GroundingChunk[] }> => {
  try {
    const prompt = `Find real ${type}s near "${location}". 
    List up to 5. 
    Respond ONLY with a valid JSON array of objects. 
    Each object must have these keys: "name", "address", "phone", and "description".
    Do not include any introductory text, closing text, or markdown formatting.`;
    
    const response = await ai.models.generateContent({
        model: chatModel,
        contents: prompt,
        config: {
            tools: [{googleSearch: {}}],
        }
    });
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
    const jsonString = response.text.trim();

    try {
      const providers = JSON.parse(jsonString);
      if (Array.isArray(providers)) {
          return { providers, sources };
      }
    } catch (parseError) {
      console.error("Error parsing JSON from AI response:", parseError);
      return { 
        providers: [{
          name: "Formatting Error",
          address: "The AI returned data in an unexpected format.",
          phone: "N/A",
          description: "This can sometimes happen with complex searches. Please try rephrasing your search query."
        }], 
        sources 
      };
    }
    
    return { providers: [], sources };

  } catch (error) {
    console.error(`Error finding nearby healthcare for type ${type}:`, error);
    return {
      providers: [{
        name: "Error Fetching Data",
        address: "Could not retrieve information from the server.",
        phone: "N/A",
        description: "Please check your connection and try again. The AI service may be temporarily unavailable."
      }],
      sources: []
    };
  }
};
