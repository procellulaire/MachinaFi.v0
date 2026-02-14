export interface Token {
  category: string; // TokenID
  amount: bigint;
  nft?: {
    capability: 'none' | 'mutable' | 'minting';
    commitment: string;
  };
}

export interface UTXO {
  txid: string;
  vout: number;
  satoshis: bigint;
  token?: Token;
  address: string; // P2SH (Contract) or P2PKH (Wallet)
  isContract: boolean;
}

export interface Policy {
  maxWithdrawal: number; // in BCH
  allowedTokens: string[];
  minCollateralRatio: number; // percentage
  requireMultiSig: boolean;
  whitelistedContracts?: string[];
}

export interface MarketState {
  price: number; // BCH/USD
  trend: 'up' | 'down' | 'flat';
  volatility: number;
}

export interface AgentDecision {
  action: 'TRADE' | 'HOLD' | 'ERROR';
  amount?: number; // BCH amount involved
  reasoning: string;
  targetContract?: string;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  actor: 'SYSTEM' | 'AGENT' | 'CONTRACT' | 'OWNER';
  message: string;
  status: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
}
