import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Activity, Zap, Shield, Cpu, RefreshCw, Play as PlayIcon } from 'lucide-react';
import { useSnake } from './hooks/useSnake';
import SynthPlayer from './components/SynthPlayer';

export default function App() {
  const { snake, food, gameOver, score, isPaused, GRID_SIZE, resetGame, setIsPaused } = useSnake();

  return (
    <div className="bg-[#050505] flex flex-col h-screen w-full overflow-hidden text-[#e5e5e5] font-sans">
      <div className="absolute inset-0 scanlines z-50 pointer-events-none"></div>
      
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 glass z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-sm flex items-center justify-center font-bold text-black">S</div>
          <h1 
            className="text-2xl font-extrabold tracking-tighter uppercase neon-text-cyan glitch-text"
            data-text="Synth-Snake"
          >
            Synth-Snake <span className="text-white/30 font-light font-sans tracking-normal ml-2">v2.4</span>
          </h1>
        </div>
        <div className="flex gap-8 font-mono text-xs tracking-widest uppercase">
          <div className="flex flex-col items-end">
            <span className="text-white/40">Connection</span>
            <span className="text-green-400">Secure // 124ms</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white/40">System</span>
            <span className="text-cyan-400">Operational</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        
        {/* Left Aside: Playlist & Visualizer (Now handled by SynthPlayer) */}
        <aside className="w-80 flex flex-col gap-6">
          <SynthPlayer />
        </aside>

        {/* Center: Game Canvas */}
        <section className="flex-1 relative flex flex-col items-center justify-center bg-black/40 rounded-2xl neon-border overflow-hidden">
          {/* Score Overlays */}
          <div className="absolute top-6 left-6 flex flex-col items-start z-10">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">Current Score</div>
            <div className="text-5xl font-digital font-bold text-white tracking-tighter">
              {score.toString().padStart(6, '0')}
            </div>
          </div>
          <div className="absolute top-6 right-6 flex flex-col items-end z-10">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">Hi-Score</div>
            <div className="text-5xl font-digital font-bold neon-text-magenta tracking-tighter">005,800</div>
          </div>

          {/* Snake Board */}
          <div 
            className="relative border border-white/5 bg-black/60 shadow-2xl"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_SIZE}, 22px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 22px)`,
              gap: '1px'
            }}
          >
            {/* Grid Placeholder for aesthetic if needed, but we use logic */}
            {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => (
              <div key={i} className="w-[22px] h-[22px] border border-[#111]" />
            ))}

            {/* Actual Snake rendering overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_SIZE}, 22px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 22px)`,
              gap: '1px'
            }}>
              {snake.map((p, i) => (
                <div
                  key={`${i}-${p.x}-${p.y}`}
                  className={`w-[22px] h-[22px] ${i === 0 ? 'bg-[#00f3ff] shadow-[0_0_12px_#00f3ff] z-10' : 'bg-[#39ff14] shadow-[0_0_10px_#39ff14]'} rounded-sm`}
                  style={{
                    gridColumnStart: p.x + 1,
                    gridRowStart: p.y + 1,
                  }}
                />
              ))}

              {/* Food */}
              <div
                className="w-[22px] h-[22px] bg-[#ff00ff] shadow-[0_0_10px_#ff00ff] rounded-full"
                style={{
                  gridColumnStart: food.x + 1,
                  gridRowStart: food.y + 1,
                }}
              />
            </div>
          </div>

          <div className="absolute bottom-8 flex gap-4 text-[10px] font-mono uppercase tracking-widest text-white/30">
            <span>[W] Up</span>
            <span>[A] Left</span>
            <span>[S] Down</span>
            <span>[D] Right</span>
            <span className="ml-4 opacity-50">Press Space to Pause</span>
          </div>

          {/* Overlays */}
          <AnimatePresence>
            {(gameOver || isPaused) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 text-center"
              >
                {gameOver ? (
                  <>
                    <h2 
                      className="text-6xl font-extrabold text-[#ff00ff] mb-4 tracking-tighter uppercase neon-text-magenta glitch-text"
                      data-text="Connection_Lost"
                    >
                      Connection_Lost
                    </h2>
                    <p className="text-white/40 mb-8 text-xs uppercase tracking-[0.3em] font-mono">Neural link severed at score: {score}</p>
                    <button 
                      onClick={resetGame}
                      className="px-10 py-4 border border-[#ff00ff] text-[#ff00ff] uppercase tracking-widest text-xs font-bold hover:bg-[#ff00ff] hover:text-black transition-all"
                    >
                      Re-Initialize Link
                    </button>
                  </>
                ) : (
                  <>
                    <h2 
                      className="text-6xl font-extrabold text-[#00f3ff] mb-4 tracking-tighter uppercase neon-text-cyan glitch-text"
                      data-text="Neural_Paused"
                    >
                      Neural_Paused
                    </h2>
                    <p className="text-white/40 mb-8 text-xs uppercase tracking-[0.3em] font-mono">Standby for data synchronization</p>
                    <button 
                      onClick={() => setIsPaused(false)}
                      className="px-10 py-4 border border-[#00f3ff] text-[#00f3ff] uppercase tracking-widest text-xs font-bold hover:bg-[#00f3ff] hover:text-black transition-all"
                    >
                      Resume Sync
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Right Aside: Ranking & Reset */}
        <aside className="w-72 flex flex-col gap-6">
          <div className="p-5 glass neon-border rounded-xl flex-1 flex flex-col">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-6 text-white/50 border-b border-white/10 pb-2">Global Ranking</h2>
            <div className="space-y-5 flex-1">
              {[
                { rank: '01', user: 'ZE_RO', score: '9,240', color: 'text-cyan-400' },
                { rank: '02', user: 'FL0W', score: '8,810', color: 'text-white/70' },
                { rank: '03', user: 'K1LL', score: '7,400', color: 'text-white/50' },
              ].map((item) => (
                <div key={item.rank} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono ${item.color}`}>{item.rank}</span>
                    <span className="text-sm font-semibold">{item.user}</span>
                  </div>
                  <span className="text-xs font-mono opacity-50">{item.score}</span>
                </div>
              ))}
              
              <div className="mt-8 p-4 bg-magenta-500/10 border border-magenta-500/20 rounded-lg text-center">
                <p className="text-[10px] uppercase text-magenta-400 mb-1">New Level Unlocked</p>
                <p className="text-xs font-bold">CYBER_PLAZA_04</p>
              </div>
            </div>
            
            <button 
              onClick={resetGame}
              className="w-full py-4 bg-white/5 border border-white/10 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors"
            >
              Reset Game
            </button>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="h-24 border-t border-white/10 glass px-8 flex items-center gap-12 z-40">
        <div className="flex items-center gap-4 w-64">
          <div className="w-12 h-12 rounded bg-cyan-500/20 flex items-center justify-center">
            <div className="w-6 h-6 bg-cyan-400"></div>
          </div>
          <div>
            <p className="text-sm font-bold">Neural Flux</p>
            <p className="text-xs text-white/40 uppercase font-mono tracking-tighter italic">Operational Core</p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-center gap-10">
            <button className="text-white/40 hover:text-white transition-colors cursor-pointer">
              <RefreshCw size={20} />
            </button>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform cursor-pointer">
               <Zap fill="currentColor" />
            </div>
            <button className="text-white/40 hover:text-white transition-colors cursor-pointer">
              <Activity size={20} />
            </button>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full relative">
            <motion.div 
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 top-0 h-full bg-cyan-400 shadow-[0_0_10px_#00f3ff]"
            />
          </div>
        </div>

        <div className="w-64 flex items-center justify-end gap-4">
           <div className="text-[10px] uppercase tracking-widest text-white/20 font-mono">
             AIS_STABLE_BUILD_v2.0
           </div>
        </div>
      </footer>
    </div>
  );
}
