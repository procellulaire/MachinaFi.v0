import React, { useState, useEffect, useCallback } from 'react';
import TerminalHeader from './components/TerminalHeader';
import AgentConsole from './components/AgentConsole';
import MarketWidget from './components/MarketWidget';
import PolicyPanel from './components/PolicyPanel';
import ContractViewer from './components/ContractViewer';
import { UTXO, Policy, MarketState, LogEntry, AgentDecision } from './types';
import { INITIAL_UTXOS, INITIAL_POLICY } from './constants';
import { getAgentDecision } from './services/geminiService';
import { verifyCovenant } from './services/contractService';

const App: React.FC = () => {
  // State
  const [utxos, setUtxos] = useState<UTXO[]>(INITIAL_UTXOS);
  const [policy, setPolicy] = useState<Policy>(INITIAL_POLICY);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [market, setMarket] = useState<MarketState>({ price: 450.50, trend: 'flat', volatility: 0.02 });
  const [marketHistory, setMarketHistory] = useState<{time: string, price: number}[]>([]);
  const [latestDecision, setLatestDecision] = useState<AgentDecision | undefined>(undefined);

  // Helper to add logs
  const addLog = useCallback((actor: LogEntry['actor'], message: string, status: LogEntry['status'] = 'INFO') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      actor,
      message,
      status
    }].slice(-50)); // Keep last 50
  }, []);

  // Simulate Market Data Stream
  useEffect(() => {
    const interval = setInterval(() => {
      setMarket(prev => {
        const volatility = 0.02;
        const change = (Math.random() - 0.5) * prev.price * volatility;
        const newPrice = Math.max(0, prev.price + change);
        const newHistory = [...marketHistory, { time: new Date().toLocaleTimeString(), price: newPrice }].slice(-20);
        setMarketHistory(newHistory);
        return {
          price: newPrice,
          trend: change > 0 ? 'up' : 'down',
          volatility: Math.random() * 0.05
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [marketHistory]);

  // Initial Log
  useEffect(() => {
    addLog('SYSTEM', 'Protocol initialized. MachinaVault v1.0 deployed.', 'SUCCESS');
    addLog('SYSTEM', 'Waiting for Agent or Owner interaction...', 'INFO');
  }, [addLog]);

  // Rescue Function (Kill Switch)
  const handleRescue = () => {
    addLog('OWNER', 'INITIATING EMERGENCY RESCUE...', 'WARNING');
    const validation = verifyCovenant({ action: 'HOLD', reasoning: 'FORCE' }, utxos, policy, true);
    
    if (validation.success) {
        addLog('CONTRACT', 'Owner Signature Verified. Constraints Bypassed.', 'SUCCESS');
        addLog('SYSTEM', 'Broadcasting Sweep Transaction...', 'SUCCESS');
        setUtxos([]); // Drain wallet
        addLog('SYSTEM', 'Vault Drained. Balance: 0.00000000 BCH', 'INFO');
    }
  };

  // Core Agent Loop
  const runAgentCycle = async () => {
    if (isThinking) return;
    if (utxos.length === 0) {
        addLog('SYSTEM', 'No UTXOs in vault. Agent dormant.', 'WARNING');
        return;
    }

    setIsThinking(true);
    addLog('SYSTEM', 'Starting decision cycle...', 'INFO');

    try {
      // 1. Get AI Decision
      const decision = await getAgentDecision(policy, market, utxos);
      setLatestDecision(decision);
      
      if (decision.action === 'TRADE') {
          addLog('AGENT', `Action: TRADE via ${decision.targetContract} (${decision.amount} BCH)`, 'INFO');
          addLog('AGENT', `Reasoning: ${decision.reasoning}`, 'INFO');

          // 2. Simulate Contract Verification
          const validation = verifyCovenant(decision, utxos, policy, false);

          if (validation.success) {
            addLog('CONTRACT', 'Agent Sig Valid. Whitelist Checked.', 'SUCCESS');
            
            if (validation.newBalance !== undefined && validation.newBalance >= utxos[0].satoshis) {
                 addLog('CONTRACT', `Solvency Check Passed. Balance: ${(Number(validation.newBalance)/100000000).toFixed(8)} BCH`, 'SUCCESS');
                 addLog('SYSTEM', `TX Broadcast: ${validation.txHex?.substring(0, 16)}...`, 'SUCCESS');
                 
                 // Update State
                 setUtxos(prev => {
                    const newUtxos = [...prev];
                    if (newUtxos[0]) {
                        newUtxos[0] = { ...newUtxos[0], satoshis: validation.newBalance! };
                    }
                    return newUtxos;
                 });
            } else {
                 addLog('CONTRACT', `REVERT: Solvency Check Failed. Trade Result: Loss Detected.`, 'ERROR');
            }
          } else {
            addLog('CONTRACT', `REVERT: ${validation.error}`, 'ERROR');
          }
      } else {
          addLog('AGENT', 'Action: HOLD - No profitable arb opportunities found.', 'INFO');
      }

    } catch (e) {
      addLog('SYSTEM', 'Critical Agent Failure', 'ERROR');
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-machina-dark text-gray-300 font-sans flex flex-col">
      <TerminalHeader />
      
      <main className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col md:flex-row gap-6">
        
        {/* Left Column: Controls & Data */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
            
            {/* Market Data */}
            <div className="h-64 bg-machina-panel border border-machina-border rounded-lg p-4 shadow-lg">
                <MarketWidget market={market} dataHistory={marketHistory} />
            </div>

            {/* Policy Control */}
            <div className="flex-1 min-h-[300px]">
                <PolicyPanel policy={policy} onUpdate={setPolicy} onRescue={handleRescue} />
            </div>
            
            {/* Wallet Info */}
            <div className="bg-machina-panel border border-machina-border rounded-lg p-4">
               <h3 className="text-xs text-gray-500 font-mono mb-2">VAULT BALANCE (UTXO SET)</h3>
               <div className="text-3xl font-mono text-white font-bold tracking-tighter">
                  {(Number(utxos.reduce((acc, u) => acc + u.satoshis, 0n)) / 100_000_000).toFixed(8)} <span className="text-bch-green text-lg">BCH</span>
               </div>
               <div className="mt-2 flex gap-2">
                 {utxos[0]?.token && (
                   <span className="text-[10px] bg-purple-900/40 text-purple-300 border border-purple-800 px-2 py-1 rounded font-mono">
                     TOKEN: {utxos[0].token.category.substring(0,8)}...
                   </span>
                 )}
               </div>
            </div>

        </div>

        {/* Right Column: AI & Code */}
        <div className="w-full md:w-2/3 flex flex-col gap-6 h-full">
            
            {/* Agent Console (Main Interaction) */}
            <div className="flex-1 min-h-[400px]">
                <AgentConsole 
                    logs={logs} 
                    isThinking={isThinking} 
                    latestDecision={latestDecision}
                    onManualTrigger={runAgentCycle}
                />
            </div>

            {/* Code Visualizer */}
            <div className="h-64 hidden md:block">
                <ContractViewer />
            </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-machina-border bg-black p-2 text-center text-[10px] text-gray-600 font-mono">
        MACHINAFI PROTOTYPE | SECURED BY CASHSCRIPT | GEMINI AI INTEGRATION
      </footer>
    </div>
  );
};

export default App;
