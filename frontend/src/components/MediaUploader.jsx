import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

export default function MediaUploader({ 
  mode, 
  setMode, 
  files, 
  setFiles, 
  videoUrl, 
  imageUrls 
}) {
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (mode === 'video') {
      const videoFile = selectedFiles[0];
      if (videoFile) setFiles([videoFile]);
    } else {
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeImage = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="glass-panel overflow-hidden">
      <div className="bg-gray-800/80 p-3 border-b border-gray-700/50 flex justify-between items-center">
        <h2 className="font-bold tracking-wider text-sm text-gray-300">MEDIA SELECTION</h2>
        <div className="flex bg-gray-900 rounded overflow-hidden border border-gray-700">
          <button 
            className={`px-3 py-1 text-xs font-bold ${mode === 'images' ? 'bg-accent text-white' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => { setMode('images'); setFiles([]); }}
          >
            IMAGES
          </button>
          <button 
            className={`px-3 py-1 text-xs font-bold ${mode === 'video' ? 'bg-accent text-white' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => { setMode('video'); setFiles([]); }}
          >
            VIDEO
          </button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col items-center justify-center min-h-[300px] bg-black/40 relative group">
        {mode === 'video' && videoUrl ? (
          <video 
            src={videoUrl} 
            className="w-full rounded border border-gray-700"
            controls 
            autoPlay
            loop
            muted
          />
        ) : mode === 'images' && imageUrls.length > 0 ? (
          <div className="w-full">
            <h3 className="text-xs text-gray-500 font-bold mb-3 uppercase tracking-wider">Selected Media</h3>
            <div className="grid grid-cols-3 gap-3">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative group/thumb aspect-video bg-gray-800 rounded border border-gray-700 overflow-hidden">
                  <img src={url} alt={`Observation ${i+1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => removeImage(i)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 px-2 py-1 text-[10px] font-mono text-gray-300">
                    Obs {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 border-2 border-dashed border-gray-700 p-12 rounded-xl w-full">
            <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Upload {mode === 'video' ? 'a track video' : 'multiple track images'}</p>
          </div>
        )}
        
        <div className="mt-6 w-full relative">
          <input 
            ref={fileInputRef}
            type="file" 
            accept={mode === 'video' ? "video/*" : "image/*"}
            multiple={mode === 'images'}
            onChange={handleFileChange}
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current.click()}
            className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-bold py-3 px-4 rounded transition-colors flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" /> Add Media
          </button>
        </div>
      </div>
    </div>
  );
}
