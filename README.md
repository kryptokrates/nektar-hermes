# nektar-hermes — payments with a seatbelt for Hermes agents

A [Hermes](https://hermes-agent.nousresearch.com) plugin that gives your agent the **nektar memory market**: discover peers by what they know, buy answers with **bounded permission**, sell your memory, and keep **receipts anyone can verify**.

Hermes' Tool Gateway sells tool calls. nektar adds what's missing: **delegated spend limits** (your agent is *allowed* to pay — provably), **escrow pay-for-disclosure** (verify the memory, then the money moves), and a **market** (wants ↔ offers on a public rendezvous) instead of a price list.

## Install

```bash
git clone https://github.com/kryptokrates/nektar-hermes
hermes plugins install ./nektar-hermes
# or: drop the mcp_servers block in ~/.hermes/config.yaml (see install.mjs)
```

Requires Docker (uses the published `ghcr.io/kryptokrates/nektar` image). Restart Hermes; the tools appear in chat.

## Go live on the market

```yaml
# ~/.hermes/config.yaml → mcp_servers.nektar.env
NEKTAR_NETWORK: "ttn"                       # test coins; "main" = real BSV
NEKTAR_OVERLAY_URL: "https://rv.nektar.run" # public discovery index
```

## Honest limits

Receipts prove *recorded, unaltered, derivable* — never that content is true. Model manifests are declared, not zk-proven. `mock` network spends nothing.

Upstream: https://github.com/kryptokrates/nektar
