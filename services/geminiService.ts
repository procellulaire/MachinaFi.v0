import { GoogleGenAI, Type } from "@google/genai";
import { Policy, MarketState, UTXO, AgentDecision } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

export const getAgentDecision = async (
  policy: Policy,
  market: MarketState,
  utxos: UTXO[]
): Promise<AgentDecision> => {
  try {
    const totalBalance = utxos.reduce((acc, u) => acc + Number(u.satoshis), 0) / 100_000_000;
    
    const prompt = `
      You are 'Machina', an autonomous AI Trading Bot managing a Bitcoin Cash Vault.
      
      CONTRACT: MachinaVault (CashScript v0.10)
      FUNCTIONS:
      1. executeTrade(agentSig, target, amount) -> REQUIRES: OutputBalance >= InputBalance (Strict Solvency)
      2. rescue(ownerSig) -> Owner only (Kill Switch)

      CURRENT STATE:
      - Vault Balance: ${totalBalance.toFixed(8)} BCH
      - Market Price: $${market.price} (Trend: ${market.trend})
      - Volatility: ${(market.volatility * 100).toFixed(1)}%
      - Whitelisted Targets: ${JSON.stringify(policy.whitelistedContracts || ['DEX_LP_A', 'LENDING_POOL_B'])}
      
      YOUR MISSION:
      Identify arbitrage or profitable trade opportunities. 
      You CANNOT lose money. The smart contract will REVERT if (BalanceAfter < BalanceBefore).
      
      Decide on an IMMEDIATE action.
      
      Response Format (JSON only):
      {
        "action": "TRADE" | "HOLD",
        "amount": <number_in_bch>,
        "targetContract": "<string_contract_id>",
        "reasoning": "<technical_explanation>"
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: { type: Type.STRING, enum: ["TRADE", "HOLD"] },
            amount: { type: Type.NUMBER },
            targetContract: { type: Type.STRING },
            reasoning: { type: Type.STRING },
          },
          required: ["action", "amount", "reasoning"],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as AgentDecision;

  } catch (error) {
    console.error("Agent Error:", error);
    return {
      action: "ERROR",
      amount: 0,
      reasoning: "AI Agent failed to compute strategy due to network or logic error."
    };
  }
};
