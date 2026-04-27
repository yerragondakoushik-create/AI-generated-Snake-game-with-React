import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, Music, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  { id: 1, title: 'NEURAL_PHASE_01', artist: 'GEN_SYNTH_01', duration: '3:45' },
  { id: 2, title: 'VOID_CACHING', artist: 'GEN_SYNTH_02', duration: '4:20' },
  { id: 3, title: 'BIT_TEAR_PROTOCOL', artist: 'GEN_SYNTH_03', duration: '2:55' },
];

export default function SynthPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const track = TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.5));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextTrack = () => {
    setCurrentTrackIndex(prev => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="glass neon-border p-5 rounded-xl relative overflow-hidden group">
      <h2 className="text-xs font-bold uppercase tracking-widest mb-6 text-white/50 border-b border-white/10 pb-2">Neon Playlist</h2>
      
      <div className="space-y-4 mb-8">
        {TRACKS.map((t, i) => (
          <div 
            key={t.id}
            onClick={() => {
              setCurrentTrackIndex(i);
              setIsPlaying(true);
            }}
            className={`flex items-center gap-4 p-3 rounded-lg border transition-all cursor-pointer ${
              currentTrackIndex === i 
                ? 'bg-white/5 border-white/10' 
                : 'hover:bg-white/5 border-transparent'
            }`}
          >
            <div className={`w-10 h-10 rounded flex items-center justify-center ${currentTrackIndex === i ? 'bg-cyan-500/20' : 'bg-white/5 text-white/20'}`}>
              {currentTrackIndex === i ? (
                <div className="w-4 h-4 bg-cyan-400 animate-pulse" />
              ) : (
                <span className="text-[10px] font-mono">{String(i + 1).padStart(2, '0')}</span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p 
                className={`text-lg font-bold truncate transition-all ${currentTrackIndex === i ? 'glitch-text neon-text-cyan' : 'text-white/80'}`}
                data-text={t.title}
              >
                {t.title}
              </p>
              <p className="text-[10px] uppercase text-white/40 font-mono">{t.artist}</p>
            </div>
            {currentTrackIndex === i ? (
               <div className="text-cyan-400">
                 <Play size={16} fill="currentColor" />
               </div>
            ) : (
              <span className="text-[10px] text-white/20">{t.duration}</span>
            )}
          </div>
        ))}
      </div>

      <div className="p-5 glass neon-border rounded-xl">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/50">Visualizer</h2>
        <div className="flex items-end gap-1 h-16">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                height: isPlaying ? Math.random() * 100 + '%' : '10%' 
              }}
              transition={{ 
                duration: 0.2, 
                repeat: isPlaying ? Infinity : 0,
                repeatType: 'reverse'
              }}
              className="flex-1 bg-cyan-500/40 border-t border-cyan-400"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
