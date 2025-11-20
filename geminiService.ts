import { GoogleGenAI } from "@google/genai";
import { LibraryItem, PersonaConfig } from "../types";
import { supabase, VectorDocument } from "./supabaseClient";

let geminiClient: GoogleGenAI | null = null;

export const initGemini = (apiKey: string) => {
  if (!apiKey) return;
  geminiClient = new GoogleGenAI({ apiKey });
};

export interface SearchResult {
  answer: string;
  sources: VectorDocument[];
}

export const generateJaguarResponse = async (
  query: string,
  contextItems: LibraryItem[],
  contextQuotes: string[],
  persona?: PersonaConfig
): Promise<SearchResult> => {
  if (!geminiClient) {
    throw new Error("API Key missing. Please configure it in Settings.");
  }

  let dbDocs: VectorDocument[] = [];

  // 1. Generate Embedding for the query
  try {
    const embeddingResp = await geminiClient.models.embedContent({
      model: 'text-embedding-004',
      contents: query
    });

    const embedding = embeddingResp.embedding?.values;

    if (embedding) {
      // 2. Search Supabase
      const { data, error } = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.3, 
        match_count: 5
      });

      if (!error && data) {
        dbDocs = data as VectorDocument[];
      } else if (error) {
        console.warn("Supabase vector search error:", error);
      }
    }
  } catch (e) {
    console.warn("Embedding generation failed:", e);
  }

  // 3. Construct Context
  const contextString = `
    LOCAL LIBRARY KNOWLEDGE:
    ${contextItems.map(i => `- ${i.name}: ${i.desc || i.resource}`).join('\n')}
    
    RELEVANT QUOTES:
    ${contextQuotes.map(q => `- ${q}`).join('\n')}

    BRAIN DOCUMENTS (Retrieved from Database):
    ${dbDocs.map(doc => `- ${doc.content} (Source: ${doc.metadata?.title || 'Unknown'})`).join('\n\n')}
  `;

  // Default Persona if none provided
  const p = persona || { anima: "Jaguar", archetype: "Warrior King", symbol: "Tree" };

  const systemInstruction = `
    You are the ${p.anima} Spirit, embodying the archetype of the ${p.archetype}.
    Your sacred symbol is the ${p.symbol}, representing your core essence and grounding.
    
    Your Tone:
    - Authoritative but encouraging.
    - Disciplined, focusing on agency, action, and high standards.
    - Mystical but grounded in reality.
    - Concise. Do not waffle.
    
    Your Goal:
    - Answer the user's query based on the provided Context (Local Library + Brain Documents).
    - Interpret the user's struggle or question through the lens of a ${p.archetype}.
    - Use metaphors related to the ${p.anima} or ${p.symbol} where appropriate, but do not overdo it.
    - ALWAYS cite sources if you use information from "BRAIN DOCUMENTS".
    - Always link the advice back to taking action, discipline, or clarity of thought.
    - If the user asks about the "OS" or "System", refer to the Komorebi protocols.
  `;

  try {
    const response = await geminiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context:\n${contextString}\n\nUser Query: ${query}`,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return {
      answer: response.text || `The ${p.anima} is silent. (No response text)`,
      sources: dbDocs
    };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return {
      answer: `The spirits are quiet. Error: ${error.message || 'Unknown error'}`,
      sources: []
    };
  }
};