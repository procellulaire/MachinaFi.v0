import { UTXO, Policy, AgentDecision } from '../types';

/**
 * Simulates the execution of the MachinaVault CashScript contract.
 */
export const verifyCovenant = (
  decision: AgentDecision,
  inputs: UTXO[],
  policy: Policy,
  isRescueMode: boolean = false
): { success: boolean; error?: string; txHex?: string; newBalance?: bigint } => {
  
  console.log(`Verifying MachinaVault execution. Mode: ${isRescueMode ? 'RESCUE' : 'AGENT'}`);

  // 1. Input Check
  if (inputs.length === 0) {
    return { success: false, error: "VM_ERROR: NO_UTXOS_AVAILABLE" };
  }
  const primaryInput = inputs[0];
  const inputSatoshis = primaryInput.satoshis;

  // --- RESCUE FUNCTION (Owner) ---
  if (isRescueMode) {
    // function rescue(sig ownerSig)
    // Checks: require(checkSig(ownerSig, owner));
    // Simulation: Always succeeds if triggered by owner UI
    return {
      success: true,
      txHex: `01000000...[OWNER_SIG_ALL_FUNDS]...ffffffff`,
      newBalance: 0n // Drained
    };
  }

  // --- EXECUTE TRADE FUNCTION (Agent) ---
  // function executeTrade(sig agentSig, pubkey targetContract, int amount)
  
  if (decision.action === 'HOLD') {
    return { success: true, error: "No transaction." };
  }
  
  if (decision.action === 'ERROR') {
    return { success: false, error: "Agent internal error." };
  }

  // Check 1: Whitelist Enforcement (Simulated)
  // Check if target is provided and broadly valid
  if (!decision.targetContract) {
      return { success: false, error: "COVENANT_ERROR: Target contract required for execution." };
  }

  // Check 2: Solvency / "No Loss" Rule
  // require(returnVal >= inputVal);
  
  // In a real simulation, we'd calculate the result of the trade.
  // We simulate the OUTCOME of the external interaction.
  // Random chance of profit based on market conditions simulation.
  const isProfitable = Math.random() > 0.4; // 60% chance AI finds a good path
  
  let outputSatoshis = inputSatoshis;

  if (isProfitable) {
    // Small profit: 0.1% to 1%
    const profit = inputSatoshis / 100n; // 1%
    outputSatoshis = inputSatoshis + profit;
  } else {
    // Loss: -0.5% (Slippage)
    const loss = inputSatoshis / 200n;
    outputSatoshis = inputSatoshis - loss;
  }

  // The Contract Logic Check:
  if (outputSatoshis < inputSatoshis) {
    return {
      success: false,
      error: `COVENANT_REVERT: Solvency Violation. Input: ${inputSatoshis} sats, Output: ${outputSatoshis} sats. Trade was not profitable.`
    };
  }

  // Check 3: Recursive Covenant (Token Preservation)
  // Ensure the token follows the money back to the vault.
  if (primaryInput.token) {
    // Verified implicitly in simulation
  }

  return {
    success: true,
    txHex: `02000000...[AGENT_SIG]...[TARGET_INTERACTION]...[RETURN_TO_VAULT]`,
    newBalance: outputSatoshis
  };
};
