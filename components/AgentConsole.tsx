import React, { useEffect, useRef } from 'react';
import { Terminal, Play, AlertOctagon, CheckCircle } from 'lucide-react';
import { LogEntry, AgentDecision } from '../types';

interface AgentConsoleProps {
  logs: LogEntry[];
  isThinking: boolean;
  latestDecision?: AgentDecision;
  onManualTrigger: () => void;
}

const AgentConsole: React.FC<AgentConsoleProps> = ({ logs, isThinking, latestDecision, onManualTrigger }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-machina-panel border border-machina-border rounded-lg overflow-hidden shadow-2xl">
      {/* Toolbar */}
      <div className="bg-machina-border/30 p-2 flex items-center justify-between border-b border-machina-border">
        <div className="flex items-center space-x-2 px-2">
          <Terminal size={14} className="text-neon-cyan" />
          <span className="text-xs font-mono font-bold text-gray-300">GEMINI AGENT NODE</span>
        </div>
        <button 
          onClick={onManualTrigger}
          disabled={isThinking}
          className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-bold font-mono transition-all
            ${isThinking 
              ? 'bg-yellow-500/20 text-yellow-500 cursor-not-allowed' 
              : 'bg-bch-green text-black hover:bg-white hover:shadow-[0_0_10px_rgba(10,193,142,0.8)]'
            }`}
        >
          {isThinking ? (
            <><span>PROCESSING...</span></>
          ) : (
            <><Play size={10} /><span>EXECUTE CYCLE</span></>
          )}
        </button>
      </div>

      {/* Log Output */}
      <div 
        ref={scrollRef}
        className="flex-1 bg-black p-4 font-mono text-xs overflow-y-auto space-y-2 relative"
      >
        {logs.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-700">
            <div className="text-center">
                <p>Waiting for network events...</p>
                <p className="text-[10px] mt-1">System ready.</p>
            </div>
          </div>
        )}

        {logs.map((log) => (
          <div key={log.id} className="flex space-x-2 animate-in fade-in duration-300">
            <span className="text-gray-600 min-w-[60px]">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}</span>
            <span className={`font-bold ${
                log.actor === 'SYSTEM' ? 'text-blue-500' : 
                log.actor === 'AGENT' ? 'text-neon-cyan' : 'text-orange-500'
            }`}>[{log.actor}]</span>
            <span className={`${
                log.status === 'ERROR' ? 'text-red-500' : 
                log.status === 'SUCCESS' ? 'text-green-400' : 
                log.status === 'WARNING' ? 'text-yellow-400' : 'text-gray-300'
            }`}>
              {log.message}
            </span>
          </div>
        ))}
        
        {isThinking && (
          <div className="flex space-x-2">
             <span className="text-gray-600">...</span>
             <span className="text-neon-cyan animate-pulse">▐</span>
          </div>
        )}
      </div>

      {/* Decision Viz */}
      {latestDecision && (
        <div className="bg-machina-dark border-t border-machina-border p-3">
            <div className="flex items-start space-x-3">
                <div className="mt-1">
                    {latestDecision.action === 'ERROR' ? <AlertOctagon className="text-red-500" size={20} /> : <CheckCircle className="text-bch-green" size={20} />}
                </div>
                <div>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 font-mono">LATEST DECISION</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            latestDecision.action === 'TRADE' ? 'bg-purple-900 text-purple-200' :
                            latestDecision.action === 'HOLD' ? 'bg-gray-800 text-gray-300' : 'bg-red-900 text-red-200'
                        }`}>
                            {latestDecision.action}
                        </span>
                    </div>
                    {latestDecision.amount ? (
                         <div className="text-lg font-mono text-white font-bold my-1">
                            {latestDecision.amount} BCH
                         </div>
                    ) : null}
                    <p className="text-xs text-gray-400 italic">
                        "{latestDecision.reasoning}"
                    </p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AgentConsole;