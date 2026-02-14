import React from 'react';
import { ShieldCheck, Cpu, Activity } from 'lucide-react';

const TerminalHeader: React.FC = () => {
  return (
    <header className="border-b border-machina-border bg-machina-panel p-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-bch-green/10 rounded border border-bch-green/30">
          <Cpu className="text-bch-green w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-mono tracking-tighter text-white">
            MACHINA<span className="text-bch-green">FI</span>
          </h1>
          <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             <span>MAINNET: CONNECTED</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="text-right hidden md:block">
           <div className="text-xs text-gray-500 font-mono">SECURE CONTEXT</div>
           <div className="text-sm text-neon-cyan font-bold flex items-center justify-end space-x-1">
             <ShieldCheck size={14} />
             <span>ZERO TRUST ACTIVE</span>
           </div>
        </div>
      </div>
    </header>
  );
};

export default TerminalHeader;
