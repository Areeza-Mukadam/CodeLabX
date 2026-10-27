import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import { createReadStream } from 'node:fs'
import { readFile, readdir, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { extractTraceJVMRuntimeArchive } from '@tracecode/tracejvm/runtime-package'

const packageRoot = fileURLToPath(new URL('./node_modules/@tracecode/tracejvm/', import.meta.url))
const pyodideRoot = join(packageRoot, '../../pyodide')
const wasmOjBrowserAssets = fileURLToPath(new URL('./node_modules/@wasm-oj/browser/dist/assets/', import.meta.url))
const clangAssets = fileURLToPath(new URL('./node_modules/@wasm-oj/toolchain-clang/assets/', import.meta.url))
const wasmOjNotices = fileURLToPath(new URL('./node_modules/@wasm-oj/browser/THIRD_PARTY_NOTICES.md', import.meta.url))
const clangNotices = fileURLToPath(new URL('./node_modules/@wasm-oj/toolchain-clang/THIRD_PARTY_NOTICES.md', import.meta.url))
const sqliteWasm = fileURLToPath(new URL('./node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3.wasm', import.meta.url))
const runtimeManifest = JSON.parse(await readFile(join(packageRoot, 'runtime-release/manifest.json'), 'utf8'))
const runtimeArchive = join(packageRoot, 'runtime-release', runtimeManifest.archive.path)
const runtimeRoot = join(tmpdir(), 'codelabx-tracejvm-0.4.1')
let runtimeReady: Promise<void> | undefined

function traceJvmAssets(mode: 'serve' | 'build'): Plugin {
  const ensureRuntime = () => runtimeReady ??= (async () => {
    try {
      await stat(join(runtimeRoot, 'release.json'))
    } catch {
      await extractTraceJVMRuntimeArchive({
        archivePath: runtimeArchive,
        destination: runtimeRoot,
        files: runtimeManifest.files,
      })
    }
  })()
  return {
    name: 'tracejvm-runtime-assets',
    apply: mode,
    configureServer(server: any) {
      server.middlewares.use('/tracejvm', async (request: any, response: any, next: (error?: unknown) => void) => {
        try {
          await ensureRuntime()
          const relative = decodeURIComponent((request.url || '/').split('?')[0]).replace(/^\/+/, '')
          const path = resolve(runtimeRoot, relative)
          if (!path.startsWith(`${runtimeRoot}${sep}`) || !(await stat(path)).isFile()) return next()
          response.setHeader('Content-Type', mimeType(path))
          response.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
          createReadStream(path).pipe(response)
        } catch (error) { next(error) }
      })
      server.middlewares.use('/pyodide', async (request: any, response: any, next: (error?: unknown) => void) => {
        const relative = decodeURIComponent((request.url || '/').split('?')[0]).replace(/^\/+/, '')
        const path = resolve(pyodideRoot, relative)
        try {
          if (!path.startsWith(`${pyodideRoot}${sep}`) || !(await stat(path)).isFile()) return next()
          response.setHeader('Content-Type', mimeType(path))
          createReadStream(path).pipe(response)
        } catch { next() }
      })
    },
    async buildStart() {
      if (mode !== 'build') return
      await ensureRuntime()
      for (const file of runtimeManifest.files) {
        if (!['browser-worker.js', 'browser-client.js', 'bjvm_main.wasm', 'release.json'].includes(file.path)
          && !file.path.startsWith('compiler/')
          && !file.path.startsWith('profiles/core/')
          && !file.path.startsWith('legal/')) continue
        this.emitFile({ type: 'asset', fileName: `tracejvm/${file.path}`, source: await readFile(join(runtimeRoot, file.path)) })
      }
      for (const fileName of ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json']) {
        this.emitFile({ type: 'asset', fileName: `pyodide/${fileName}`, source: await readFile(join(pyodideRoot, fileName)) })
      }
      for (const fileName of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
        this.emitFile({ type: 'asset', fileName: `tracejvm/legal/NPM-${fileName}`, source: await readFile(join(packageRoot, fileName)) })
      }
    },
  }
}

function browserLanguageAssets(mode: 'serve' | 'build'): Plugin {
  return {
    name: 'browser-language-runtime-assets',
    apply: mode,
    configureServer(server: any) {
      const serveFile = (root: string, requestPath: string, response: any, next: (error?: unknown) => void) => {
        const name = decodeURIComponent(requestPath.split('?')[0].split('/').pop() || '')
        if (!name || name.includes('..')) return next()
        const path = resolve(root, name)
        stat(path).then((info) => {
          if (!info.isFile()) return next()
          response.setHeader('Content-Type', mimeType(path))
          response.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
          createReadStream(path).pipe(response)
        }).catch(() => next())
      }
      server.middlewares.use('/toolchains', (request: any, response: any, next: (error?: unknown) => void) => serveFile(clangAssets, request.url || '/', response, next))
      server.middlewares.use('/assets', (request: any, response: any, next: (error?: unknown) => void) => serveFile(wasmOjBrowserAssets, request.url || '/', response, next))
      server.middlewares.use('/sqlite3.wasm', (_request: any, response: any, next: (error?: unknown) => void) => {
        response.setHeader('Content-Type', 'application/wasm')
        response.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
        createReadStream(sqliteWasm).on('error', next).pipe(response)
      })
    },
    async buildStart() {
      if (mode !== 'build') return
      for (const file of await readdir(wasmOjBrowserAssets)) {
        this.emitFile({ type: 'asset', fileName: `assets/${file}`, source: await readFile(join(wasmOjBrowserAssets, file)) })
      }
      for (const file of await readdir(clangAssets)) {
        this.emitFile({ type: 'asset', fileName: `toolchains/${file}`, source: await readFile(join(clangAssets, file)) })
      }
      this.emitFile({ type: 'asset', fileName: 'sqlite3.wasm', source: await readFile(sqliteWasm) })
      this.emitFile({ type: 'asset', fileName: 'licenses/WASM-OJ-BROWSER-THIRD-PARTY-NOTICES.md', source: await readFile(wasmOjNotices) })
      this.emitFile({ type: 'asset', fileName: 'licenses/WASM-OJ-CLANG-THIRD-PARTY-NOTICES.md', source: await readFile(clangNotices) })
    },
  }
}

function mimeType(path: string) {
  if (path.endsWith('.wasm')) return 'application/wasm'
  if (path.endsWith('.mjs') || path.endsWith('.js')) return 'text/javascript; charset=utf-8'
  if (path.endsWith('.json')) return 'application/json; charset=utf-8'
  if (path.endsWith('.zip') || path.endsWith('.jar')) return 'application/octet-stream'
  return 'application/octet-stream'
}

export default defineConfig({
  plugins: [traceJvmAssets('serve'), traceJvmAssets('build'), browserLanguageAssets('serve'), browserLanguageAssets('build'), react(), tailwindcss()],
  server: {
    allowedHosts: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
  preview: { headers: { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'credentialless' } },
})
