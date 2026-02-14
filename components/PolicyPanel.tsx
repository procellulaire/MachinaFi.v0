import React from 'react';
import { Policy } from '../types';
import { Lock, Settings, Skull } from 'lucide-react';

interface PolicyPanelProps {
  policy: Policy;
  onUpdate: (newPolicy: Policy) => void;
  onRescue: () => void;
}

const PolicyPanel: React.FC<PolicyPanelProps> = ({ policy, onUpdate, onRescue }) => {
  
  const handleChange = (key: keyof Policy, value: any) => {
    onUpdate({ ...policy, [key]: value });
  };

  return (
    <div className="bg-machina-panel border border-machina-border rounded-lg p-4 h-full flex flex-col">
        <div className="flex items-center space-x-2 mb-6 border-b border-machina-border pb-2">
            <Settings className="text-gray-400" size={16} />
            <h2 className="text-sm font-bold font-mono text-white">COVENANT PARAMETERS</h2>
        </div>

        <div className="space-y-6 flex-1">
            <div className="space-y-2">
                <label className="text-xs text-gray-400 font-mono flex items-center justify-between">
                    <span>MAX TRADE SIZE (BCH)</span>
                    <Lock size={10} className="text-green-500" />
                </label>
                <div className="flex items-center space-x-2">
                    <input 
                        type="range" 
                        min="0.01" 
                        max="0.5" 
                        step="0.01" 
                        value={policy.maxWithdrawal}
                        onChange={(e) => handleChange('maxWithdrawal', parseFloat(e.target.value))}
                        className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-bch-green"
                    />
                    <span className="text-neon-cyan font-mono text-sm w-12 text-right">{policy.maxWithdrawal}</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs text-gray-400 font-mono">WHITELISTED PROTOCOLS</label>
                <div className="flex flex-wrap gap-2">
                    {(policy.whitelistedContracts || ['DEX_V1', 'LEND_V2']).map(contract => (
                        <span key={contract} className="px-2 py-1 text-[10px] bg-blue-900/20 text-blue-300 border border-blue-800 rounded font-mono">
                            {contract}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        <div className="mt-6 bg-red-950/30 border border-red-900/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
                <Skull size={16} className="text-red-500" />
                <span className="text-xs text-red-400 font-bold tracking-widest">KILL SWITCH</span>
            </div>
            <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">
                Invokes <span className="text-white font-mono">rescue()</span>. Bypasses all AI logic and constraints. Sweeps entire vault balance to Owner Wallet.
            </p>
            <button 
                onClick={onRescue}
                className="w-full py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono rounded shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all flex items-center justify-center space-x-2"
            >
                <span>EXECUTE RESCUE</span>
            </button>
        </div>
    </div>
  );
};

export default PolicyPanel;
