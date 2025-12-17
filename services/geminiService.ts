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

// Robust helper to extract JSON array from text mixed with citations like [1]
const extractJsonArray = (text: string): string => {
  if (!text) return "[]";

  // 1. Try to extract from Markdown code blocks first
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    text = codeBlockMatch[1];
  }

  // 2. Find the start of a JSON array containing objects
  // We look for '[' followed immediately by optional whitespace and '{'
  // This distinction is CRITICAL to avoid matching citation markers like [1], [2], [Source]
  const startMatch = text.match(/\[\s*\{/);
  
  if (!startMatch || typeof startMatch.index === 'undefined') {
    // Fallback: If no strict object array found, try finding just the outer brackets 
    // but only if it looks like it might be JSON (contains quotes/braces)
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket > firstBracket && text.includes('{')) {
        return text.substring(firstBracket, lastBracket + 1);
    }
    return "[]";
  }

  const startIndex = startMatch.index;

  // 3. Find the last closing bracket ']'
  const endIndex = text.lastIndexOf(']');
  
  if (endIndex > startIndex) {
    return text.substring(startIndex, endIndex + 1);
  }

  return "[]";
};

// Schema for Character Generation (Kept for reference/unused functions)
const characterSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    name: { type: Type.STRING },
    subtitle: { type: Type.STRING },
    type: { type: Type.STRING, enum: ['AGL', 'TEQ', 'INT', 'STR', 'PHY'] },
    class: { type: Type.STRING, enum: ['Super', 'Extreme'] },
    rarity: { type: Type.STRING, enum: ['UR', 'LR', 'TUR', 'EZA'] },
    categories: { type: Type.ARRAY, items: { type: Type.STRING } },
    links: { type: Type.ARRAY, items: { type: Type.STRING } },
    leaderSkill: { type: Type.STRING },
    passiveSkill: { type: Type.STRING },
    stats: {
      type: Type.OBJECT,
      properties: {
        hp: { type: Type.NUMBER },
        atk: { type: Type.NUMBER },
        def: { type: Type.NUMBER },
      },
      required: ['hp', 'atk', 'def']
    }
  },
  required: ['id', 'name', 'type', 'class', 'rarity', 'categories', 'links', 'stats', 'leaderSkill', 'passiveSkill']
};

export const suggestCharacters = async (query: string): Promise<Character[]> => {
  try {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a list of 3-5 Dragon Ball Z Dokkan Battle characters that match this search query: "${query}". Return real characters from the game with accurate stats/skills where possible. Make sure IDs are unique random strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: characterSchema
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) return [];
    
    return JSON.parse(jsonStr) as Character[];
  } catch (error) {
    console.error("Error generating characters:", error);
    return [];
  }
};

export const generateTeamFromInput = async (inputText: string): Promise<{ characters: Character[], sources: string[] }> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model,
      contents: `The user wants to build a Dokkan Battle team with these specific characters: "${inputText}".
      
      You have access to Google Search. Use it to find the MOST RECENT and ACCURATE details for these characters (especially if they are new releases like 10th Anniversary, WWC 2025, or recent EZAs).
      
      Generate a JSON array of Character objects for each name mentioned.
      
      Strict Rules:
      1. Return ONLY the raw JSON array. Do not include markdown formatting (no \`\`\`json).
      2. The structure must match this schema exactly for each character:
      {
        "id": "unique-string",
        "name": "Character Name",
        "subtitle": "Subtitle",
        "type": "AGL"|"TEQ"|"INT"|"STR"|"PHY",
        "class": "Super"|"Extreme",
        "rarity": "UR"|"LR"|"TUR"|"EZA",
        "categories": ["string"],
        "links": ["string"],
        "leaderSkill": "string",
        "passiveSkill": "string",
        "stats": { "hp": number, "atk": number, "def": number }
      }
      3. Identify the specific version the user likely means (usually the strongest/newest LR or EZA).
      4. Ensure stats are high for current meta based on the search results.`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const rawText = response.text || "";
    // Use the robust extractor
    const jsonStr = extractJsonArray(rawText);
    
    let characters: Character[] = [];
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        characters = parsed.map(sanitizeCharacter);
      } else {
         console.warn("Parsed JSON is not an array:", parsed);
      }
    } catch (e) {
      console.error("Failed to parse JSON from grounded response. Raw:", rawText, "Extracted:", jsonStr);
    }

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = (chunks as any[])
      .map((chunk: any) => chunk.web?.uri)
      .filter((uri: any): uri is string => typeof uri === 'string');
      
    const uniqueSources = Array.from(new Set(sources));
    
    return { characters, sources: uniqueSources };
  } catch (error) {
    console.error("Error generating team from text:", error);
    return { characters: [], sources: [] };
  }
};

export const generateFullTeamFromCategory = async (category: string): Promise<{ characters: Character[], sources: string[] }> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model,
      contents: `Build the absolute BEST Dragon Ball Z Dokkan Battle team for the category: "${category}".
      
      You have access to Google Search. Use it to find the current META (Most Effective Tactic Available) units, including 10th Anniversary, 2024/2025 releases, and recent EZAs.

      Requirements:
      1. Return exactly 7 characters: 
         - Index 0: The best Leader for this category.
         - Index 1-5: The best 5 sub-units (synergy, tanking, damage).
         - Index 6: A Friend Leader (usually same as Index 0 or a compatible 200% lead).
      2. Ensure the team has 200% Leader Skill coverage if possible.
      
      Generate a JSON array of Character objects.
      
      Strict Rules:
      1. Return ONLY the raw JSON array. Do not include markdown formatting.
      2. The structure MUST match this schema exactly:
      {
        "id": "unique-string",
        "name": "Character Name",
        "subtitle": "Subtitle",
        "type": "AGL"|"TEQ"|"INT"|"STR"|"PHY",
        "class": "Super"|"Extreme",
        "rarity": "UR"|"LR"|"TUR"|"EZA",
        "categories": ["string"],
        "links": ["string"],
        "leaderSkill": "string",
        "passiveSkill": "string",
        "stats": { "hp": number, "atk": number, "def": number }
      }
      3. Stats should reflect Rainbow (100%) hidden potential stats found online.
      4. Do not include citation markers like [1] or [Source] inside the JSON.`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const rawText = response.text || "";
    // Use the robust extractor
    const jsonStr = extractJsonArray(rawText);
    
    let characters: Character[] = [];
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        characters = parsed.map(sanitizeCharacter);
      } else {
        console.warn("Parsed JSON is not an array:", parsed);
      }
    } catch (e) {
      console.error("Failed to parse JSON from grounded response. Raw:", rawText, "Extracted:", jsonStr);
    }

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = (chunks as any[])
      .map((chunk: any) => chunk.web?.uri)
      .filter((uri: any): uri is string => typeof uri === 'string');
      
    const uniqueSources = Array.from(new Set(sources));
    
    return { characters, sources: uniqueSources };
  } catch (error) {
    console.error("Error generating category team:", error);
    return { characters: [], sources: [] };
  }
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