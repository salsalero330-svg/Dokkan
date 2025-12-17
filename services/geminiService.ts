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
 * 1. Extracts content from markdown code blocks
 * 2. Finds the outer-most [] pair
 * 3. Removes trailing commas which cause JSON.parse to fail
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
      // If strict array not found, try to be lenient if it looks like a list of objects
      if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
          // Wrap single object in array
          text = `[${text}]`;
      } else {
          return "[]";
      }
  } else {
      text = text.substring(start, end + 1);
  }

  // 3. Remove trailing commas (e.g., "prop": "val", } -> "prop": "val" })
  // Regex explanation: Match a comma, followed by whitespace, followed by closing brace or bracket.
  // Replace with just the closing symbol.
  text = text.replace(/,\s*([\]}])/g, '$1');

  return text;
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
      contents: `USER REQUEST: Build a Dokkan Battle team with these characters: "${inputText}".
      
      INSTRUCTIONS:
      1. Use Google Search to find stats for these specific units (prioritize newest versions).
      2. Return a JSON Array of character objects.
      3. NO conversational text. Output ONLY valid JSON.
      
      JSON STRUCTURE:
      [
        {
          "id": "unique-id",
          "name": "Name",
          "subtitle": "Subtitle",
          "type": "AGL/TEQ/INT/STR/PHY",
          "class": "Super/Extreme",
          "rarity": "LR/UR",
          "categories": ["Cat1", "Cat2"],
          "links": ["Link1", "Link2"],
          "leaderSkill": "Leader Skill Text",
          "passiveSkill": "Passive Text",
          "stats": { "hp": 10000, "atk": 10000, "def": 5000 }
        }
      ]`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a database API that returns only strictly formatted JSON arrays. Do not use markdown unless it contains the JSON.",
      }
    });

    const rawText = response.text || "";
    const jsonStr = cleanJsonString(rawText);
    
    let characters: Character[] = [];
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        characters = parsed.map(sanitizeCharacter);
      }
    } catch (e) {
      console.error("Failed to parse JSON. Raw:", rawText, "Cleaned:", jsonStr);
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
      contents: `TASK: Create the BEST POSSIBLE Dragon Ball Z Dokkan Battle team for the "${category}" Category.
      
      STEPS:
      1. Search for the best 200% Leader for "${category}".
      2. Select top-tier meta units (focus on 9th/10th Anniversary, WWC 2024/2025).
      3. Construct a team of 7 units (1 Leader, 5 Subs, 1 Friend).
      
      OUTPUT FORMAT:
      Return a JSON ARRAY only. Do not add intro/outro text.
      
      [
        {
          "id": "rand1",
          "name": "Character Name",
          "subtitle": "Subtitle",
          "type": "AGL", 
          "class": "Super",
          "rarity": "LR",
          "categories": ["${category}", "Other"],
          "links": ["Link1", "Link2"],
          "leaderSkill": "Description",
          "passiveSkill": "Description",
          "stats": { "hp": 20000, "atk": 20000, "def": 10000 }
        }
      ]
      
      Ensure valid JSON. No trailing commas.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a JSON generator. You never output conversational text. You output strictly formatted JSON arrays.",
      }
    });

    const rawText = response.text || "";
    const jsonStr = cleanJsonString(rawText);
    
    let characters: Character[] = [];
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        characters = parsed.map(sanitizeCharacter);
      }
    } catch (e) {
      console.error("Failed to parse JSON. Raw:", rawText, "Cleaned:", jsonStr);
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