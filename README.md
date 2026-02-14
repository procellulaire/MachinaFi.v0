==========================================================================
BCH-1 Hackcelerator MVP 

This is a Statement of Work (SOW) designed for a Senior Architect executing a hackathon speed-run. 
I will treat Google AI Studio as my "Junior Dev Team" 

- I define the architecture and security constraints, and AI Studio generates the implementation code.
- I am the human in the loop, master of the code
  
Project SOW: MachinaFi – Zero-Trust Agent Liquidity Protocol
Objective: Build a functional MVP of MachinaVault (Smart Contract) and Machina-Dashboard (UI) on Bitcoin Cash.
Tools: Google AI Studio (Gemini 1.5 Pro), CashScript, Next.js, Chaingraph.
Timeline: 4 Phases (Hackathon Sprint).

==========================================================================

Project SOW: MachinaFi – Zero-Trust Agent Liquidity Protocol
Objective: Build a functional MVP of MachinaVault (Smart Contract) and Machina-Dashboard (UI) on Bitcoin Cash.
Tools: Google AI Studio (Gemini 1.5 Pro), CashScript, Next.js, Chaingraph.
Timeline: 4 Phases (Hackathon Sprint).

Phase 0: The "Context Injection" (Setup)
Before writing code, we must prime Google AI Studio with the correct context. Gemini knows Solidity well, but CashScript (BCH) requires specific framing regarding UTXOs and "Covenants."

Phase 1: The Core Contract (MachinaVault.cash)
Goal: Create the "Smart Vault" that holds funds and enforces the Zero Trust rules.






==========================================================================
==========================================================================

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
