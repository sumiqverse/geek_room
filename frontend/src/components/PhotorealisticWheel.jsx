import React from 'react';

export default function PhotorealisticWheel({ onStart, vibrating }) {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4">
      
      {/* 
        Container with Entrance, Float, and Vibration animations 
      */}
      <div 
        className={`relative w-full max-w-[800px] flex items-center justify-center 
          ${vibrating ? 'animate-[engineVibrate_0.05s_ease-in-out_infinite]' : 'animate-[wheelEntrance_1.2s_cubic-bezier(0.16,1,0.3,1)]'}
        `}
        style={{
          animationFillMode: 'forwards'
        }}
      >

        <div className={`relative w-full flex items-center justify-center ${!vibrating ? 'animate-[float_4s_ease-in-out_infinite]' : ''}`} style={{ animationDelay: '1.2s' }}>
          <img 
            src="/image.png" 
            alt="F1 Steering Wheel" 
            className="w-full h-auto object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.9)]"
          />

          <button 
            onClick={onStart}
            title="Start Engine"
            disabled={vibrating}
            className={`absolute z-50 flex items-center justify-center w-[12%] aspect-square rounded-full group cursor-pointer transition-all duration-300 -translate-x-1/2 -translate-y-1/2 ${vibrating ? 'opacity-0 scale-90' : 'opacity-100'}`}
            style={{ top: '75.5%', left: '50%' }}
          >
            <div className="absolute inset-0 rounded-full bg-blue-500/20 group-hover:bg-cyan-400/40 border-2 border-cyan-400/30 group-hover:border-cyan-300 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.4)]"></div>
            <div className="absolute -inset-[2px] rounded-full border-[2px] border-cyan-400/50 animate-ping opacity-60"></div>
            <div className="absolute inset-0 rounded-full bg-blue-400/10 blur-md group-hover:bg-blue-400/30 transition-colors"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
