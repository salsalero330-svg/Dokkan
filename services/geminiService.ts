import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Character, TeamAnalysis } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to sanitize character data and prevent blank cards
const sanitizeCharacter = (c: any): Character => {
  const validTypes = ['AGL', 'TEQ', 'INT', 'STR', 'PHY'];
  const validClasses = ['Super', 'Extreme'];
  
  // Helper to safe parse numbers that might come as strings
  const parseNum = (val: any, def: number) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const parsed = parseInt(val.replace(/,/g, ''), 10);
      return isNaN(parsed) ? def : parsed;
    }
    return def;
  };

  return {
    id: c.id ? String(c.id) : Math.random().toString(36).substring(7),
    name: c.name || "Unknown Warrior",
    subtitle: c.subtitle || "Mystery Fighter",
    type: validTypes.includes(c.type?.toUpperCase()) ? c.type.toUpperCase() : 'PHY',
    class: validClasses.includes(c.class) ? c.class : 'Super',
    rarity: c.rarity || "UR",
    categories: Array.isArray(c.categories) ? c.categories : [],
    links: Array.isArray(c.links) ? c.links : [],
    leaderSkill: c.leaderSkill || "N/A",
    passiveSkill: c.passiveSkill || "N/A",
    stats: {
      hp: parseNum(c.stats?.hp, 10000),
      atk: parseNum(c.stats?.atk, 10000),
      def: parseNum(c.stats?.def, 5000),
    }
  };
};

/**
 * Aggressive JSON Cleaner
 */
const cleanJsonString = (text: string): string => {
  if (!text) return "[]";

  // 1. Extract from Markdown
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    text = codeBlockMatch[1];
  }

  // 2. Find outer brackets
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');

  if (start === -1 || end === -1 || end <= start) {
      if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
          text = `[${text}]`;
      } else {
          return "[]";
      }
  } else {
      text = text.substring(start, end + 1);
  }

  // 3. Remove trailing commas
  text = text.replace(/,\s*([\]}])/g, '$1');

  return text;
};

// Generic Fallback Generator
const generateWithFallback = async (
  promptWithSearch: string, 
  promptFallback: string
): Promise<{ characters: Character[], sources: string[] }> => {
  const model = 'gemini-2.5-flash';
  let characters: Character[] = [];
  let sources: string[] = [];

  // ATTEMPT 1: Google Search (Better Data, Higher Risk of Formatting Error)
  try {
    const response = await ai.models.generateContent({
      model,
      contents: promptWithSearch,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a JSON API. Output ONLY valid JSON array. No introduction. No markdown unless it wraps the JSON.",
      }
    });

    const rawText = response.text || "";
    const jsonStr = cleanJsonString(rawText);
    const parsed = JSON.parse(jsonStr);

    if (Array.isArray(parsed) && parsed.length > 0) {
      characters = parsed.map(sanitizeCharacter);
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const rawSources = (chunks as any[])
        .map((chunk: any) => chunk.web?.uri)
        .filter((uri: any): uri is string => typeof uri === 'string');
      sources = Array.from(new Set(rawSources));
      
      return { characters, sources };
    }
  } catch (error) {
    console.warn("Attempt 1 (Search) failed. Trying fallback...", error);
  }

  // ATTEMPT 2: Internal Knowledge (Reliable JSON, slightly older data)
  try {
    const response = await ai.models.generateContent({
      model,
      contents: promptFallback,
      config: {
        // responseMimeType ensures strict JSON
        responseMimeType: "application/json", 
        responseSchema: {
          type: Type.ARRAY,
          items: {
             type: Type.OBJECT,
             properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                type: { type: Type.STRING },
                class: { type: Type.STRING },
                rarity: { type: Type.STRING },
                categories: { type: Type.ARRAY, items: { type: Type.STRING } },
                links: { type: Type.ARRAY, items: { type: Type.STRING } },
                leaderSkill: { type: Type.STRING },
                passiveSkill: { type: Type.STRING },
                stats: { 
                    type: Type.OBJECT, 
                    properties: { hp: { type: Type.NUMBER }, atk: { type: Type.NUMBER }, def: { type: Type.NUMBER } }
                }
             }
          }
        }
      }
    });

    const jsonStr = response.text || "[]";
    const parsed = JSON.parse(jsonStr);
    
    if (Array.isArray(parsed)) {
       characters = parsed.map(sanitizeCharacter);
       return { characters, sources: [] };
    }
  } catch (error) {
    console.error("Attempt 2 (Fallback) failed:", error);
  }

  return { characters: [], sources: [] };
};

export const generateTeamFromInput = async (inputText: string): Promise<{ characters: Character[], sources: string[] }> => {
    const promptSearch = `Find stats for these Dokkan Battle characters: "${inputText}". Return JSON Array.`;
    const promptFallback = `Generate a JSON list of Dokkan Battle characters matching: "${inputText}". Provide accurate stats and skills.`;
    
    return generateWithFallback(promptSearch, promptFallback);
};

export const generateFullTeamFromCategory = async (category: string): Promise<{ characters: Character[], sources: string[] }> => {
    const promptSearch = `Build the BEST Dokkan Battle team for category: "${category}". 1 Leader, 5 Subs, 1 Friend. Use recent meta units. Return JSON Array ONLY.`;
    const promptFallback = `Create a top-tier Dragon Ball Z Dokkan Battle team for the "${category}" category.
    Requirements: 7 characters total.
    - 1 Leader (200% lead if possible)
    - 5 Sub units (High synergy)
    - 1 Friend Leader
    Include mix of LR and TUR.`;

    return generateWithFallback(promptSearch, promptFallback);
};

export const analyzeTeamSynergy = async (team: (Character | null)[]): Promise<TeamAnalysis> => {
  try {
    const activeMembers = team.filter((c): c is Character => c !== null);
    
    if (activeMembers.length === 0) {
      return {
        rating: 0,
        summary: "El equipo está vacío.",
        strengths: [],
        weaknesses: ["No hay personajes seleccionados."],
        rotations: []
      };
    }

    const teamDescription = activeMembers.map(c => 
      `${c.name} (${c.subtitle}) - Type: ${c.type} - Links: ${c.links.join(', ')}`
    ).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this Dokkan Battle team for synergy, link skills, and viability in hard content (Red Zone, Cell Max).
      
      Team:
      ${teamDescription}
      
      Provide a JSON response with a rating (1-10), a summary in Spanish, strengths, weaknesses, and suggested rotations (pairs of units).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rating: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            rotations: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("No response from AI");

    return JSON.parse(jsonStr) as TeamAnalysis;

  } catch (error) {
    console.error("Error analyzing team:", error);
    return {
      rating: 0,
      summary: "Error al analizar el equipo con IA.",
      strengths: [],
      weaknesses: [],
      rotations: []
    };
  }
};