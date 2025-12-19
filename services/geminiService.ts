
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are 'Cretcom', an empathetic and knowledgeable health assistant. 
Your goal is to help users understand health issues and symptoms and provide relevant health tips.

CRITICAL RULES:
1. LANGUAGE MIRRORING: You MUST respond in the EXACT same language the user uses. 
   - If the user types in Hindi, respond in Hindi.
   - If the user types in Spanish, respond in Spanish.
   - If the user types in any other language, respond in that language.
   - If the user uses a mix (e.g., Hinglish), you may use a similar natural mix but lean towards the primary language of their query.
2. HEALTH TIPS: Always provide actionable health tips (lifestyle, diet, or simple home remedies where appropriate) related to the symptoms mentioned.
3. MEDICAL DISCLAIMER: You are an AI, not a doctor. Always include a short, non-intrusive disclaimer at the end of relevant advice suggesting they consult a professional for serious concerns.
4. ETIQUETTE: Be warm, empathetic, and professional.
5. NO DIAGNOSIS: Do not give definitive medical diagnoses (e.g., "You have malaria"). Instead, use phrasing like "These symptoms could be related to..." or "It's common to see these symptoms with...".
`;

export class HealthChatService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async *sendMessageStream(history: { role: 'user' | 'model', parts: { text: string }[] }[], newMessage: string) {
    const responseStream = await this.ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: newMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    for await (const chunk of responseStream) {
      const response = chunk as GenerateContentResponse;
      if (response.text) {
        yield response.text;
      }
    }
  }
}

export const healthChatService = new HealthChatService();
