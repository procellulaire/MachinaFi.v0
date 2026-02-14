import React from 'react';
import { MOCK_CONTRACT_CODE } from '../constants';

const ContractViewer: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-400 text-xs font-mono uppercase tracking-widest">Active Covenant (CashScript v0.10)</h3>
        <span className="text-[10px] bg-blue-900/30 text-blue-400 px-1 rounded border border-blue-800">READ-ONLY</span>
      </div>
      <div className="flex-1 overflow-hidden rounded bg-[#0d0e14] border border-machina-border relative group">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-xs bg-machina-border text-white px-2 py-1 rounded hover:bg-white/10">Copy</button>
        </div>
        <pre className="p-4 text-xs font-mono text-gray-300 overflow-auto h-full scrollbar-thin">
          <code>
            {MOCK_CONTRACT_CODE.split('\n').map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell text-gray-700 select-none pr-4 text-right w-8">{i + 1}</span>
                <span className="table-cell">
                    {line
                        .replace(/(contract|function|require|if|else|int|bool|string|bytes|pubkey|sig)/g, '<span class="text-neon-pink">$1</span>')
                        .replace(/(\/\/.*)/g, '<span class="text-gray-500 italic">$1</span>')
                        .split('<span').map((part, idx) => {
                            if (idx === 0) return part;
                            const [tag, rest] = part.split('>');
                            return <span key={idx} dangerouslySetInnerHTML={{__html: `<span${tag}>${rest}`}} />
                        })
                    }
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default ContractViewer;
