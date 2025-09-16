
import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: "The name of the recipe.",
      },
      prepTime: {
        type: Type.STRING,
        description: "Estimated preparation time, e.g., '30 minutes'.",
      },
      ingredients: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "List of all necessary ingredients with quantities.",
      },
      instructions: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "Step-by-step cooking instructions.",
      },
    },
  },
};

export async function generateRecipesFromImage(
  base64ImageData: string,
  mimeType: string,
  dietaryRestrictions: string
): Promise<Recipe[]> {
  try {
    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: `Identify the food ingredients in this image. Based ONLY on the identified ingredients and the following dietary restrictions, generate up to 3 unique recipe ideas.

      Dietary restrictions: "${dietaryRestrictions || "None"}"

      For each recipe, provide a name, a list of ingredients (including amounts), a list of step-by-step instructions, and the estimated preparation time. If you cannot identify any usable food ingredients, return an empty array.
      `,
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        return [];
    }
    
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as Recipe[];

  } catch (error) {
    console.error("Error generating recipes:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate recipes: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating recipes.");
  }
}
