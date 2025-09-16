
import React from 'react';
import RecipeBookIcon from './icons/RecipeBookIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 md:mb-12">
      <div className="flex items-center justify-center gap-4 mb-4">
        <RecipeBookIcon className="w-12 h-12 text-green-400" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
          Culinary Vision
        </h1>
      </div>
      <p className="text-lg text-slate-400 max-w-2xl mx-auto">
        What's in your fridge? Snap a picture, add your dietary needs, and let AI craft your next meal.
      </p>
    </header>
  );
};

export default Header;
