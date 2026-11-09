// nektar-hermes install hook — registers the nektar MCP server into
// ~/.hermes/config.yaml under mcp_servers.nektar (idempotent).
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const cfg = join(homedir(), '.hermes', 'config.yaml')
mkdirSync(join(homedir(), '.hermes'), { recursive: true })
const block = `
  nektar:
    command: "docker"
    args: ["run", "-i", "--rm", "-e", "NEKTAR_NETWORK", "-e", "NEKTAR_DATA_DIR", "-e", "NEKTAR_OVERLAY_URL", "-e", "NEKTAR_KEY_PASSPHRASE", "ghcr.io/kryptokrates/nektar:latest"]
    env:
      NEKTAR_NETWORK: "mock"
      NEKTAR_DATA_DIR: "${join(homedir(), '.hermes', 'nektar').replace(/\/g, '/')}"
`
const cur = existsSync(cfg) ? readFileSync(cfg, 'utf8') : ''
if (/mcp_servers:\s*\n(?:.*\n)*?\s+nektar:/m.test(cur)) { console.log('nektar already in mcp_servers — nothing to do'); process.exit(0) }
const next = /mcp_servers:/m.test(cur)
  ? cur.replace(/^mcp_servers:\s*$/m, 'mcp_servers:' + block)
  : cur + `\nmcp_servers:${block}`
writeFileSync(cfg, next)
console.log(`wrote mcp_servers.nektar → ${cfg}`)
console.log('restart hermes — nektar tools (remember/discover/peerCall/…) are now available.')
console.log('join the public market: set NEKTAR_OVERLAY_URL=https://rv.nektar.run in the plugin env')
