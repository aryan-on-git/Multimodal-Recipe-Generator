
import React from 'react';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-700 hover:border-green-500 transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-2xl font-bold text-green-400 mb-3">{recipe.name}</h3>
      <p className="text-sm text-slate-400 mb-4">
        <span className="font-semibold">Prep time:</span> {recipe.prepTime}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-slate-200 mb-2 border-b border-slate-600 pb-1">Ingredients</h4>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-slate-200 mb-2 border-b border-slate-600 pb-1">Instructions</h4>
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
