import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { analyzeVideo, analyzeImages } from './services/api';
import MediaUploader from './components/MediaUploader';
import ConditionCard from './components/ConditionCard';
import ConfidenceCard from './components/ConfidenceCard';
import StrategySignal from './components/StrategySignal';
import TrackEvolution from './components/TrackEvolution';
import SectorMap from './components/SectorMap';
import ObservationTimeline from './components/ObservationTimeline';
import AnalysisSummary from './components/AnalysisSummary';
import DecisionCard from './components/DecisionCard';
import SplashScreen from './components/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [sectorData, setSectorData] = useState({
    sector_1: { mode: 'images', files: [] },
    sector_2: { mode: 'images', files: [] },
    sector_3: { mode: 'images', files: [] },
    sector_4: { mode: 'images', files: [] },
    sector_5: { mode: 'images', files: [] }
  });
  
  const [expandedSector, setExpandedSector] = useState('sector_1');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [activeViewSector, setActiveViewSector] = useState('sector_1');
  const [error, setError] = useState(null);

  const updateSectorFiles = (sec, newFiles) => {
    setSectorData(prev => ({
      ...prev,
      [sec]: { ...prev[sec], files: typeof newFiles === 'function' ? newFiles(prev[sec].files) : newFiles }
    }));
  };

  const updateSectorMode = (sec, newMode) => {
    setSectorData(prev => ({
      ...prev,
      [sec]: { ...prev[sec], mode: newMode }
    }));
  };

  const hasAnyFiles = Object.values(sectorData).some(data => data.files.length > 0);

  const handleGlobalAnalyze = async () => {
    if (!hasAnyFiles) return;
    
    setAnalyzing(true);
    setError(null);

    try {
      const newResults = { ...results };
      let firstAnalyzed = null;
      let latestGlobalSectors = null;

      const promises = ['sector_1', 'sector_2', 'sector_3', 'sector_4', 'sector_5'].map(async (sec) => {
        const dataObj = sectorData[sec];
        if (dataObj.files.length > 0) {
          let data;
          if (dataObj.mode === 'video') {
            data = await analyzeVideo(dataObj.files[0], sec);
          } else {
            data = await analyzeImages(dataObj.files, sec);
          }
          newResults[sec] = data;
          latestGlobalSectors = data.sectors;
          if (!firstAnalyzed) firstAnalyzed = sec;
        }
      });

      await Promise.all(promises);

      if (latestGlobalSectors) {
        Object.keys(newResults).forEach(key => {
          if (newResults[key]) newResults[key].sectors = latestGlobalSectors;
        });
      }

      setResults(newResults);

      if (firstAnalyzed) {
        setActiveViewSector(firstAnalyzed);
      }
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err.message || "Failed to analyze media");
    } finally {
      setAnalyzing(false);
    }
  };

  const getSectorLabel = (sec) => {
    if (sec === 'sector_1') return 'ZONE 1 (Turn 1)';
    if (sec === 'sector_2') return 'ZONE 2 (Turn 4)';
    if (sec === 'sector_3') return 'ZONE 3 (Turn 8)';
    if (sec === 'sector_4') return 'ZONE 4 (Turn 11)';
    if (sec === 'sector_5') return 'ZONE 5 (Turn 15)';
    return sec;
  };

  const currentResult = results ? results[activeViewSector] : null;

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans max-w-[1400px] mx-auto relative overflow-hidden">

      <div className="absolute top-0 right-0 w-1/3 h-[800px] bg-red-600/5 -skew-x-12 translate-x-32 pointer-events-none"></div>
      
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      <header className="mb-10 flex items-center justify-between border-b-[3px] border-[#222] pb-4 relative">
        <div className="absolute bottom-[-3px] left-0 w-32 h-[3px] bg-red-600 shadow-[0_0_10px_#ff0000]"></div>
        
        <div className="flex items-center gap-4">
          <div className="w-2 h-12 bg-red-600 -skew-x-12"></div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white italic">
              WEATHER <span className="text-red-600">WHIPLASH</span>
            </h1>
            <p className="text-gray-500 f1-text text-[10px] mt-1 tracking-[0.3em]">

            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-black/50 px-4 py-2 border border-[#333] -skew-x-12">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]"></div>
          <span className="text-red-500 font-bold f1-text text-sm skew-x-12">LIVE_FEED</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="space-y-4">
          
          {['sector_1', 'sector_2', 'sector_3', 'sector_4', 'sector_5'].map((sec) => (
            <div key={sec} className={`f1-panel overflow-hidden transition-all duration-300 ${expandedSector === sec ? 'border-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.15)]' : 'border-[#222]'}`}>
              <div 
                className={`p-4 flex justify-between items-center cursor-pointer ${expandedSector === sec ? 'bg-[#0f0f0f] border-b border-[#333]' : 'bg-[#050505] hover:bg-[#111]'}`}
                onClick={() => setExpandedSector(sec)}
              >
                <div className="flex items-center gap-3">
                  <h2 className={`font-black tracking-widest text-sm f1-text uppercase ${expandedSector === sec ? 'text-white' : 'text-gray-500'}`}>
                    [ {getSectorLabel(sec)} ]
                  </h2>
                  {sectorData[sec].files.length > 0 && (
                    <span className="bg-red-600/20 border border-red-600/50 text-red-500 f1-text text-[9px] px-2 py-0.5 font-bold">
                      {sectorData[sec].files.length} FILE{sectorData[sec].files.length !== 1 ? 'S' : ''}
                    </span>
                  )}
                </div>
                <span className="text-red-600 font-black text-xs">
                  {expandedSector === sec ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </span>
              </div>
              
              {expandedSector === sec && (
                <div className="p-4 bg-black/20">
                  <MediaUploader 
                    mode={sectorData[sec].mode} 
                    setMode={(m) => updateSectorMode(sec, m)} 
                    files={sectorData[sec].files} 
                    setFiles={(f) => updateSectorFiles(sec, f)}
                  />
                </div>
              )}
            </div>
          ))}

          <button 
            onClick={handleGlobalAnalyze} 
            disabled={analyzing || !hasAnyFiles}
            className={`w-full py-4 mt-6 -skew-x-12 border-[2px] font-black tracking-[0.2em] transition-all text-lg f1-text uppercase relative group overflow-hidden ${
              analyzing 
                ? 'bg-[#111] border-[#333] text-gray-600 cursor-not-allowed' 
                : !hasAnyFiles
                ? 'bg-[#0a0a0a] border-[#222] text-[#444] cursor-not-allowed'
                : 'bg-red-600 border-red-500 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]'
            }`}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="skew-x-12 inline-block relative z-10">
              {analyzing ? 'PROCESSING_TELEMETRY...' : 'INITIATE_FULL_ANALYSIS'}
            </span>
          </button>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded font-mono text-sm mt-6">
              ERROR: {error}
            </div>
          )}

          {currentResult && (
            <div className="mt-8">
              <AnalysisSummary result={currentResult} mode={sectorData[activeViewSector].mode} zoneLabel={getSectorLabel(activeViewSector)} />
              <ObservationTimeline observations={currentResult.observations} mode={sectorData[activeViewSector].mode} />
            </div>
          )}
        </div>

        <div className="space-y-6">
          
          {results && (
            <div className="flex gap-1 p-1 bg-[#0a0a0a] border border-[#222] mb-4 relative">

              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-red-600"></div>
              
              {['sector_1', 'sector_2', 'sector_3', 'sector_4', 'sector_5'].map((sec) => (
                <button
                  key={sec}
                  disabled={!results[sec]}
                  onClick={() => setActiveViewSector(sec)}
                  className={`flex-1 py-2 f1-text text-[10px] font-bold tracking-widest transition-all border-b-2 ${
                    !results[sec] 
                      ? 'opacity-50 cursor-not-allowed text-gray-500 border-transparent'
                      : activeViewSector === sec
                      ? 'bg-[#111] text-red-500 border-red-600 shadow-[inset_0_2px_10px_rgba(220,38,38,0.1)]'
                      : 'text-gray-300 border-transparent hover:text-white hover:bg-[#111]'
                  }`}
                >
                  {sec === 'sector_1' ? 'Z1' : sec === 'sector_2' ? 'Z2' : sec === 'sector_3' ? 'Z3' : sec === 'sector_4' ? 'Z4' : 'Z5'} DATA
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ConditionCard results={results} />
            <ConfidenceCard 
              condition={currentResult?.current_condition}
              visualConfidence={currentResult?.visual_confidence}
              trendConfidence={currentResult?.trend_confidence}
              trend={currentResult?.trend}
            />
            <DecisionCard signalData={currentResult?.strategy_signal} />
          </div>

          <StrategySignal 
            signalData={currentResult?.strategy_signal} 
            previousCondition={currentResult?.previous_condition}
            currentCondition={currentResult?.current_condition}
            trend={currentResult?.trend}
          />

          {results && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
              <div className="f1-panel p-6 lg:col-span-1 border-t-2 border-t-gray-600">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-1.5 bg-gray-500"></div>
                  <h3 className="font-bold tracking-widest text-[10px] text-gray-400 f1-text">TRACK_ZONES_MAP</h3>
                </div>
                <SectorMap sectors={currentResult?.sectors || {}} />
              </div>
              <div className="f1-panel p-6 lg:col-span-2 border-t-2 border-t-red-600">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-1.5 bg-red-600 animate-pulse"></div>
                  <h3 className="font-bold tracking-widest text-[10px] text-red-500 f1-text">SPATIAL_CONDITION_PROFILE</h3>
                </div>
                <TrackEvolution results={results} />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
