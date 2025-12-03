import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a compelling, professional, yet catchy marketing description (max 80 words) for a home cleaning product named "${productName}" which belongs to the "${category}" category. Focus on efficiency, safety, and the fresh feeling it brings to a Romanian home.`,
      config: {
        maxOutputTokens: 200,
        temperature: 0.7,
      }
    });
    
    return response.text || "Could not generate description at this time.";
  } catch (error) {
    console.error("Error generating description:", error);
    throw error;
  }
};