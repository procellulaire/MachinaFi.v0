import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MarketState } from '../types';

interface MarketWidgetProps {
  market: MarketState;
  dataHistory: { time: string; price: number }[];
}

const MarketWidget: React.FC<MarketWidgetProps> = ({ market, dataHistory }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-gray-400 text-xs font-mono uppercase tracking-widest">BCH Oracle Price</h3>
          <div className="text-2xl font-mono font-bold text-white">
            ${market.price.toFixed(2)}
          </div>
        </div>
        <div className={`text-sm font-mono px-2 py-1 rounded ${market.trend === 'up' ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20'}`}>
          {market.trend === 'up' ? '▲ BULLISH' : '▼ BEARISH'}
        </div>
      </div>

      <div className="flex-1 min-h-[150px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataHistory}>
            <XAxis dataKey="time" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#12141c', border: '1px solid #1e2330', borderRadius: '4px' }}
              itemStyle={{ color: '#0AC18E', fontFamily: 'monospace' }}
              labelStyle={{ display: 'none' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#0AC18E" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 4, fill: '#fff' }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="bg-machina-dark p-2 rounded border border-machina-border">
            <span className="text-gray-500">VOLATILITY</span>
            <div className="text-neon-pink">{(market.volatility * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-machina-dark p-2 rounded border border-machina-border">
            <span className="text-gray-500">24H VOLUME</span>
            <div className="text-white">142,030 BCH</div>
        </div>
      </div>
    </div>
  );
};

export default MarketWidget;
