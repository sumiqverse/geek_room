import { useState, useEffect } from 'react';
import { analyzeVideo, analyzeImages } from './services/api';
import MediaUploader from './components/MediaUploader';
import ConditionCard from './components/ConditionCard';
import ConfidenceCard from './components/ConfidenceCard';
import StrategySignal from './components/StrategySignal';
import TrackEvolution from './components/TrackEvolution';
import SectorMap from './components/SectorMap';
import ObservationTimeline from './components/ObservationTimeline';
import AnalysisSummary from './components/AnalysisSummary';

function App() {
  const [mode, setMode] = useState('images'); // 'images' or 'video'
  const [files, setFiles] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [sector, setSector] = useState('sector_1');
  const [error, setError] = useState(null);

  // Update object URLs when files change
  useEffect(() => {
    if (mode === 'video' && files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (mode === 'images' && files.length > 0) {
      const urls = files.map(f => URL.createObjectURL(f));
      setImageUrls(urls);
      return () => urls.forEach(url => URL.revokeObjectURL(url));
    } else {
      setVideoUrl(null);
      setImageUrls([]);
    }
  }, [files, mode]);

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    
    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      let data;
      if (mode === 'video') {
        data = await analyzeVideo(files[0], sector);
      } else {
        data = await analyzeImages(files, sector);
      }
      setResult(data);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err.message || "Failed to analyze media");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 font-sans max-w-7xl mx-auto">
      <header className="mb-8 flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-white">WEATHER <span className="text-accent">WHIPLASH</span></h1>
          <p className="text-gray-400 tracking-widest text-sm mt-1">AI TRACK CONDITION INTELLIGENCE</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-red-500 font-bold tracking-widest">LIVE</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Input & Feed */}
        <div className="space-y-6">
          <MediaUploader 
            mode={mode} 
            setMode={setMode} 
            files={files} 
            setFiles={setFiles}
            videoUrl={videoUrl}
            imageUrls={imageUrls}
          />

          <div className="flex gap-4">
            <select 
              value={sector} 
              onChange={(e) => setSector(e.target.value)}
              className="bg-gray-800 text-white font-bold tracking-wider px-4 py-3 rounded outline-none border border-gray-700 focus:border-accent flex-1"
            >
              <option value="sector_1">SECTOR 1 (Main Straight)</option>
              <option value="sector_2">SECTOR 2 (Hairpin)</option>
              <option value="sector_3">SECTOR 3 (Chicane)</option>
            </select>
            
            <button 
              onClick={handleAnalyze} 
              disabled={analyzing || files.length === 0}
              className={`px-8 py-3 rounded font-bold tracking-widest transition-all ${
                analyzing 
                  ? 'bg-accent/50 cursor-not-allowed text-white/50' 
                  : files.length === 0
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-accent hover:bg-accent/90 text-white shadow-[0_0_15px_rgba(56,189,248,0.5)]'
              }`}
            >
              {analyzing ? 'ANALYZING...' : 'ANALYZE'}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded font-mono text-sm">
              ERROR: {error}
            </div>
          )}

          {result && (
            <>
              <AnalysisSummary result={result} mode={mode} />
              <ObservationTimeline observations={result.observations} mode={mode} />
            </>
          )}
        </div>

        {/* Right Column: AI Analysis */}
        <div className="space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <ConditionCard condition={result?.current_condition} />
            <ConfidenceCard 
              condition={result?.current_condition}
              visualConfidence={result?.visual_confidence}
              trendConfidence={result?.trend_confidence}
            />
          </div>

          <StrategySignal 
            signalData={result?.strategy_signal} 
            previousCondition={result?.previous_condition}
            currentCondition={result?.current_condition}
            trend={result?.trend}
          />

          {result && (
            <div className="glass-panel p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold tracking-wider text-sm text-gray-400">TRACK EVOLUTION</h3>
                <span className="text-xs font-mono text-accent">
                  {result.trend}
                </span>
              </div>
              <TrackEvolution observations={result.observations} />
            </div>
          )}

          <div className="glass-panel p-6">
            <h3 className="font-bold tracking-wider text-sm text-gray-400 mb-6">SECTOR INTELLIGENCE</h3>
            <SectorMap sectors={result?.sectors || {}} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
