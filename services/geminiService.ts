
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  constructor() {}

  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async searchWithGrounding(query: string) {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Research the latest real-time information about: ${query}. Provide a concise summary for a social media feed.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "No results found.";
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      return { text, sources };
    } catch (error) {
      console.error("Gemini Search Error:", error);
      return { text: "Error fetching data from the web. Please try again later.", sources: [] };
    }
  }

  async getTrendingSummary() {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Identify the top 3 high-impact trending topics in tech and social media globally right now. Provide a brief one-sentence context for each.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      return response.text;
    } catch (error) {
      return "Unable to fetch live trends. Staying tuned for updates.";
    }
  }
}

export const gemini = new GeminiService();
