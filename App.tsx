
import React, { useState, useCallback } from 'react';
import { generateRecipesFromImage } from './services/geminiService';
import type { Recipe } from './types';
import ImageUploader from './components/ImageUploader';
import RecipeCard from './components/RecipeCard';
import Spinner from './components/Spinner';
import Header from './components/Header';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove "data:mime/type;base64," prefix
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRecipes([]);
      setError(null);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const base64Image = await fileToBase64(imageFile);
      const generatedRecipes = await generateRecipesFromImage(
        base64Image,
        imageFile.type,
        dietaryRestrictions
      );
      
      if (generatedRecipes.length === 0) {
        setError("Could not generate any recipes. Try a different image or simpler restrictions.");
      } else {
        setRecipes(generatedRecipes);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Error: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, dietaryRestrictions]);
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Header />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 p-6 bg-slate-800/30 rounded-xl border border-slate-700">
          <ImageUploader 
            onImageChange={handleImageChange}
            previewUrl={previewUrl}
            disabled={isLoading}
          />
          <div className="flex flex-col">
            <div>
              <label htmlFor="dietary-restrictions" className="block text-sm font-medium text-slate-300 mb-2">
                Dietary Restrictions (optional)
              </label>
              <textarea
                id="dietary-restrictions"
                rows={4}
                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition placeholder:text-slate-500"
                placeholder="e.g., vegan, gluten-free, low-carb"
                value={dietaryRestrictions}
                onChange={(e) => setDietaryRestrictions(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!imageFile || isLoading}
              className="mt-auto w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500"
            >
              {isLoading ? 'Generating...' : 'Generate Recipes'}
            </button>
          </div>
        </div>

        <div className="mt-10">
          {isLoading && <Spinner />}
          {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
          
          {!isLoading && recipes.length > 0 && (
            <div className="space-y-6">
               <h2 className="text-3xl font-bold text-center text-slate-100">Your Recipe Ideas</h2>
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
              ))}
            </div>
          )}
           {!isLoading && recipes.length === 0 && !error && previewUrl && (
            <div className="text-center text-slate-500 p-8 bg-slate-800/20 rounded-lg">
                <p>Ready to discover delicious recipes from your ingredients!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
