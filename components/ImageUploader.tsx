
import React from 'react';
import PhotoIcon from './icons/PhotoIcon';

interface ImageUploaderProps {
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, previewUrl, disabled }) => {
  return (
    <div className="w-full">
      <label htmlFor="file-upload" className="block text-sm font-medium text-slate-300 mb-2">
        Upload Ingredient Photo
      </label>
      <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-slate-600 px-6 py-10 hover:border-green-500 transition-colors">
        <div className="text-center">
          {previewUrl ? (
            <img src={previewUrl} alt="Ingredients preview" className="mx-auto h-48 w-auto rounded-md object-cover" />
          ) : (
            <PhotoIcon className="mx-auto h-12 w-12 text-slate-500" />
          )}
          <div className="mt-4 flex text-sm leading-6 text-slate-400">
            <label
              htmlFor="file-upload"
              className={`relative cursor-pointer rounded-md font-semibold text-green-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 hover:text-green-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>Upload a file</span>
              <input 
                id="file-upload" 
                name="file-upload" 
                type="file" 
                className="sr-only" 
                accept="image/*"
                onChange={onImageChange}
                disabled={disabled}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-slate-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
