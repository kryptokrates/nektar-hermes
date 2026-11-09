// nektar-hermes install hook — registers the nektar MCP server with Hermes
// via `hermes mcp add` (the path that actually works — the mcp_servers YAML
// block is ignored by `hermes mcp` on v0.10.x).
// Usage: node install.mjs [path-to-bin.js]   (or NEKTAR_BIN / NEKTAR_IMAGE)
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const env = { ...process.env, PYTHONIOENCODING: 'utf-8' }
const hermes = (args) => spawnSync('hermes', args, { env, stdio: 'inherit' })

const bin = process.argv[2] ?? process.env.NEKTAR_BIN
const args = bin && existsSync(bin)
  ? ['mcp', 'add', 'nektar', '--command', process.execPath, '--args', bin]
  : ['mcp', 'add', 'nektar', '--command', 'docker', '--args', 'run', '-i', '--rm',
     '-e', 'NEKTAR_NETWORK', '-e', 'NEKTAR_DATA_DIR', '-e', 'NEKTAR_OVERLAY_URL',
     '-e', 'NEKTAR_KEY_PASSPHRASE', process.env.NEKTAR_IMAGE ?? 'ghcr.io/kryptokrates/nektar:latest']

console.log(`registering nektar MCP → ${bin ? 'local bin.js' : 'docker image'}`)
const r = hermes(args) // prompts "Enable all N tools? [Y/n/select]" — hermes mcp add accepts piped Y
if (r.status !== 0) {
  console.log('\nif it prompted for confirmation, re-run with: echo Y | node install.mjs' + (bin ? ` ${bin}` : ''))
  process.exit(r.status ?? 1)
}
console.log('\nnektar registered — verify: hermes mcp list')
console.log('go live: hermes mcp add sets env per-server; market needs NEKTAR_OVERLAY_URL=https://rv.nektar.run')
