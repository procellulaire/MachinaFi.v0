export const MOCK_CONTRACT_CODE = `
pragma cashscript ^0.10.0;

// MachinaVault
// Zero-Trust AI Hedge Fund Covenant

contract MachinaVault(pubkey owner, pubkey agent) {
    
    // 1. Algorithmic Trading with Strict Solvency
    // The Agent can interact with whitelisted contracts (e.g. DEXs).
    // The covenant enforces that the vault balance must not decrease.
    function executeTrade(sig agentSig, pubkey targetContract, int amount) {
        
        // Zero Trust: Verify Agent Identity
        require(checkSig(agentSig, agent));

        // Introspection: Enforce Target Interaction
        // Ensure Output 0 interacts with the intended whitelisted target.
        // In production, we would check: tx.outputs[0].lockingBytecode == new LockingBytecodeP2PKH(targetContract);

        // Covenant: Solvency Check & Recursive State
        // We identify the output returning to *this* contract.
        // Assuming Output 1 is the self-preservation output (change/return).
        
        int inputVal = tx.inputs[this.activeInputIndex].value;
        int returnVal = tx.outputs[1].value;

        // "Preserve Capital": The vault cannot lose sats in a trade cycle.
        // This enforces that any trade must be atomic and profitable (or neutral).
        require(returnVal >= inputVal);
        
        // Recursive Covenant: Funds must return to the exact same contract logic/address
        require(tx.outputs[1].lockingBytecode == tx.inputs[this.activeInputIndex].lockingBytecode);
    }

    // 2. Kill Switch (Human Intervention)
    // Allows the owner to bypass all AI logic and sweep funds to a safe address.
    function rescue(sig ownerSig) {
        require(checkSig(ownerSig, owner));
    }
}
`.trim();

export const INITIAL_UTXOS = [
  {
    txid: 'a1b2c3d4...',
    vout: 0,
    satoshis: 10_000_000n, // 0.1 BCH
    address: 'p2sh:machina_vault_v1',
    isContract: true,
    token: {
      category: '7f8e9d...',
      amount: 1000n, // Machina Governance Token
      nft: { capability: 'mutable' as const, commitment: 'state_01' }
    }
  }
];

export const INITIAL_POLICY = {
  maxWithdrawal: 0.1, // BCH (Hard Cap still useful for UI limits)
  allowedTokens: ['7f8e9d...'], // Token ID whitelist
  minCollateralRatio: 100, // Implied 100% solvency
  requireMultiSig: true,
  whitelistedContracts: ['mock_dex_v1', 'mock_lending_pool_v2']
};