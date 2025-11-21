import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedName, Language, Tone } from '../types';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for structured output
const nameResponseSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: "The generated name for the program.",
      },
      tagline: {
        type: Type.STRING,
        description: "A short, catchy slogan (max 5 words).",
      },
      description: {
        type: Type.STRING,
        description: "A brief explanation of why this name fits the project.",
      }
    },
    required: ["name", "tagline", "description"],
  },
};

export interface GenerationInput {
  type: 'text' | 'image' | 'similar';
  content: string; // Text, Base64 Image, or Reference Name
  mimeType?: string; // Only for image
}

export const generateProgramNames = async (
  input: GenerationInput,
  tone: Tone,
  language: Language
): Promise<GeneratedName[]> => {
  
  const promptLanguage = language === 'tr' ? 'Turkish' : 'English';
  
  let systemInstruction = "";
  let userPrompt: any = ""; // Can be string or array of parts

  if (input.type === 'text') {
    systemInstruction = `
      You are an expert naming consultant for software, startups, and tech projects.
      Your goal is to generate 6 unique, catchy, and relevant names based on the user's project description.
      
      Tone: ${tone}
      Output Language: ${promptLanguage} (The 'name' can be English or abstract if suitable, but 'tagline' and 'description' MUST be in ${promptLanguage}).
      
      Ensure the names are diverse (some compound words, some abstract, some descriptive).
    `;
    userPrompt = `Project Description: ${input.content}`;

  } else if (input.type === 'similar') {
    systemInstruction = `
      You are an expert naming consultant.
      The user likes the name "${input.content}".
      
      Your goal is to generate 6 NEW names that are similar in style, phonetics, theme, or complexity to "${input.content}".
      If the user provided name is famous (e.g. Spotify, Slack), analyze its brand vibes and generate similar quality names for a hypothetical product.
      
      Tone: ${tone}
      Output Language: ${promptLanguage} (The 'name' can be English or abstract, but 'tagline' and 'description' MUST be in ${promptLanguage}).
    `;
    userPrompt = `Generate 6 names similar in vibe to "${input.content}".`;

  } else if (input.type === 'image') {
    systemInstruction = `
      You are an expert naming consultant for brands and software.
      Analyze the provided image (Logo or visual identity).
      Identify the core shapes, colors, mood, and abstract concepts represented in the visual.
      
      Based on this visual analysis, generate 6 creative names that fit the visual identity.
      
      Tone: ${tone}
      Output Language: ${promptLanguage} (The 'name' can be English or abstract, but 'tagline' and 'description' MUST be in ${promptLanguage}).
    `;
    
    userPrompt = {
      parts: [
        {
          inlineData: {
            mimeType: input.mimeType || 'image/png',
            data: input.content // Base64 string
          }
        },
        {
          text: `Generate 6 program names that match this logo/visual style. Tone: ${tone}.`
        }
      ]
    };
  }

  try {
    // For image input, we use gemini-2.5-flash-image or fallback to flash which supports multimodal
    // The instructions say gemini-2.5-flash-image for general image tasks, or 2.5-flash for basic.
    // 2.5-flash is multimodal and sufficient for this, but let's stick to the standard model recommendation if purely image.
    // However, usually flash handles both. Let's use gemini-2.5-flash for all as it is multimodal.
    // But according to guidelines: "General Image Generation and Editing Tasks: 'gemini-2.5-flash-image'". 
    // This is Image Understanding (Vision), not generation. Gemini 2.5 Flash supports vision.
    
    const modelName = 'gemini-2.5-flash'; 

    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt, // contents can be the prompt string or the object with parts
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: nameResponseSchema,
        temperature: 0.8,
      },
    });

    if (response.text) {
      const parsedResponse = JSON.parse(response.text) as GeneratedName[];
      return parsedResponse;
    }
    
    return [];
  } catch (error) {
    console.error("Error generating names:", error);
    throw new Error("Failed to generate names");
  }
};

// Keeping this specific function for the "More like this" button on results
export const generateRelatedNames = async (
  referenceName: string,
  description: string,
  tone: Tone,
  language: Language
): Promise<GeneratedName[]> => {
  
  // Just re-use the main function logic but with context
  // We can implement it directly here or call the main one. 
  // Let's keep it separate for clarity as it uses description context which the 'similar' mode above might not have.
  
  const promptLanguage = language === 'tr' ? 'Turkish' : 'English';
  
  const systemInstruction = `
    You are an expert naming consultant.
    The user has generated a list of names for a software project and specifically LIKED the name "${referenceName}".
    
    Your goal is to generate 6 NEW names that are similar in style, phonetics, theme, or complexity to "${referenceName}".
    
    Project Context: ${description}
    Tone: ${tone}
    Output Language: ${promptLanguage}
  `;

  const userPrompt = `Generate 6 names similar to "${referenceName}" for the project described as: ${description}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: nameResponseSchema,
        temperature: 0.85,
      },
    });

    if (response.text) {
      const parsedResponse = JSON.parse(response.text) as GeneratedName[];
      return parsedResponse;
    }
    
    return [];
  } catch (error) {
    console.error("Error generating related names:", error);
    throw new Error("Failed to generate related names");
  }
};