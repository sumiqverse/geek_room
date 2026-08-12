import React, { useState, useEffect, useRef } from 'react';
import PhotorealisticWheel from './PhotorealisticWheel';

const F1CarSVG = () => (
  <svg width="300" height="80" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_30px_rgba(56,189,248,0.6)]">

    <defs>
      <filter id="motion-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4 0" />
      </filter>
    </defs>
    
    <g filter="url(#motion-blur)">

      <rect x="0" y="40" width="80" height="2" fill="#38BDF8" opacity="0.6"/>
      <rect x="20" y="55" width="60" height="2" fill="#38BDF8" opacity="0.6"/>
      <rect x="10" y="25" width="50" height="1" fill="#38BDF8" opacity="0.4"/>

      <path d="M 60,60 L 260,60 L 280,45 L 240,35 L 180,25 L 140,25 L 100,35 L 60,45 Z" fill="#0f172a" stroke="#38BDF8" strokeWidth="2"/>

      <path d="M 120,45 L 200,45 L 210,35 L 130,35 Z" fill="#1e293b"/>

      <rect x="50" y="20" width="20" height="40" fill="#0f172a" stroke="#38BDF8" strokeWidth="1"/>
      <rect x="40" y="15" width="40" height="8" fill="#38BDF8"/>

      <path d="M 260,60 L 295,60 L 290,50 L 260,50 Z" fill="#0f172a" stroke="#38BDF8" strokeWidth="1"/>

      <rect x="80" y="50" width="30" height="25" rx="5" fill="#020617" stroke="#333" strokeWidth="2"/>
      <rect x="220" y="50" width="25" height="25" rx="5" fill="#020617" stroke="#333" strokeWidth="2"/>

      <circle cx="160" cy="20" r="10" fill="#eab308"/>
    </g>
  </svg>
);

export default function SplashScreen({ onComplete }) {
  const [started, setStarted] = useState(false);
  const [fading, setFading] = useState(false);
  const [vibrating, setVibrating] = useState(false);
  const [carPosition, setCarPosition] = useState('-100%');
  const [flashOpacity, setFlashOpacity] = useState(0);
  const audioRef = useRef(null);
  const [launched, setLaunched] = useState(false);
  const audioObjRef = useRef(null);

  useEffect(() => {

    audioObjRef.current = new Audio("https://www.myinstants.com/media/sounds/v10-f1.mp3");
    audioObjRef.current.preload = "auto";
  }, []);

  const handleStart = () => {
    setStarted(true);
    setVibrating(true);
    
    if (audioObjRef.current) {
      audioObjRef.current.volume = 1.0;
      audioObjRef.current.play().catch(e => console.log('Audio play failed:', e));
    }

    setTimeout(() => {
      setLaunched(true);

      setTimeout(() => {
        onComplete();
      }, 800);
    }, 1000);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 overflow-hidden ${launched ? 'opacity-0' : 'opacity-100'}`}>

      {launched && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
          <div className="absolute top-1/4 left-0 w-full h-[2px] bg-blue-400 animate-[speedLine_0.2s_linear_infinite]"></div>
          <div className="absolute top-2/4 left-0 w-full h-[3px] bg-cyan-300 animate-[speedLine_0.3s_linear_infinite]" style={{ animationDelay: '0.1s' }}></div>
          <div className="absolute top-3/4 left-0 w-full h-[1px] bg-blue-500 animate-[speedLine_0.15s_linear_infinite]" style={{ animationDelay: '0.05s' }}></div>
        </div>
      )}

      {!started ? (
        <PhotorealisticWheel onStart={handleStart} vibrating={false} />
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center">

          {launched && (
            <div className="absolute inset-0 bg-white z-50 animate-[flash_0.8s_ease-out_forwards]"></div>
          )}

          <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
            {!launched ? (
              <PhotorealisticWheel onStart={() => {}} vibrating={true} />
            ) : (
              <div className="relative w-full aspect-video flex items-center justify-center animate-[f1Flyby_0.5s_cubic-bezier(0.4,0,1,1)_forwards]">
                <img 
                  src="/image.png" 
                  alt="F1 Car Launching" 
                  className="w-full h-auto object-contain blur-[2px] drop-shadow-[0_0_50px_rgba(0,210,255,0.8)]"
                  style={{ transform: 'scale(1.2)' }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
