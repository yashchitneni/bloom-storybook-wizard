
import React from 'react';

interface PhotoStyleCardProps {
  onPhotoUpload: (file: File) => void;
  photoPreview: string | null;
  isActive: boolean;
}

const PhotoStyleCard: React.FC<PhotoStyleCardProps> = ({ 
  onPhotoUpload,
  photoPreview,
  isActive
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onPhotoUpload(e.target.files[0]);
    }
  };
  
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Upload a photo to feature your child in the story
      </p>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {photoPreview ? (
            <div className="flex flex-col items-center">
              <img 
                src={photoPreview} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-lg"
              />
              <button 
                onClick={() => isActive && onPhotoUpload(new File([], ""))} 
                className="mt-2 text-sm text-persimmon hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <label className={`${isActive ? 'cursor-pointer' : 'cursor-not-allowed'} flex flex-col items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="mt-2 text-sm">Click to upload (JPEG/PNG)</span>
                {isActive && (
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                  />
                )}
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoStyleCard;
