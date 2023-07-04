# Setup

https://tauri.app/v1/guides/getting-started/setup/sveltekit

Choose ESLint and Prettier plugins:

```
pnpm create svelte@latest
pnpm add -D @sveltejs/adapter-static@next
```

> `svelte.config.js`
>
> ```
> // import adapter from '@sveltejs/adapter-auto';
> import adapter from '@sveltejs/adapter-static';
> import { vitePreprocess } from '@sveltejs/kit/vite';
>
> /** @type {import('@sveltejs/kit').Config} */
> const config = {
>   preprocess: vitePreprocess(),
>   kit: {
>     adapter: adapter(),
>     alias: {
>       $routes: 'src/routes',
>       $src: 'src',
>     },
>   },
> };
>
> export default config;
> ```

> `vite.config.ts`
>
> ```
> import { sveltekit } from '@sveltejs/kit/vite';
> import { defineConfig } from 'vite';
>
> export default defineConfig({
>   plugins: [sveltekit()],
>   // strict port for tauri
>   server: {
>     port: 5180,
>     strictPort: true,
>   },
>   // don't clear the logs
>   clearScreen: false,
> });
> ```

> `src/routes/+layout.ts`
>
> ```
> export const prerender = true
> export const ssr = false
> ```

> `package.json`
>
> ```
> "scripts": {
>   "vite": "vite",
>   "dev": "tauri dev",
>   "build": "tauri build -b none",
>   "debug": "tauri build -v -b none -d",
>   "preview": "vite preview",
>   "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
>   "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
>   "lint": "prettier --plugin-search-dir . --check . && eslint .",
>   "format": "prettier --plugin-search-dir . --write ."
> }
> ```

> `.prettierrc`
>
> ```
> {
>   "endOfLine": "lf",
>   "overrides": [{ "files": "*.svelte", "options": { "parser": "svelte" } }],
>   "plugins": ["prettier-plugin-svelte"],
>   "pluginSearchDirs": ["."],
>   "printWidth": 200,
>   "singleQuote": true,
>   "useTabs": false
> }
> ```

> `.eslintignore` **_and_** `.prettierignore`
>
> ```
> !.env.example
> .DS_Store
> .env
> .env.*
> /.svelte-kit
> /build
> /package
> node_modules
>
> # IDE files
> .vscode
>
> # Ignore files for PNPM, NPM and YARN
> package-lock.json
> pnpm-lock.yaml
> yarn.lock
>
> # Ignore tauri files
> /src-tauri/target
> ```

```
pnpm add -D @tauri-apps/cli
pnpm tauri init
```

1. What is your app name?
   whatever you want

2. What should the window title be?
   whatever you want

3. Where are your web assets (HTML/CSS/JS) located relative to the <current dir>/src-tauri/tauri.conf.json file that will be created?
   `../build`

4. What is the URL of your dev server?
   `http://localhost:5180`

5. What is your frontend dev command?
   `pnpm vite dev`

6. What is your frontend build command?
   `pnpm vite build`

```
pnpm update @tauri-apps/cli @tauri-apps/api --latest
pnpm outdated @tauri-apps/cli
```

Update Cargo

```
cd src-tauri
cargo update
```

> `Cargo.toml`
>
> ```
> [package]
> name = "app"
> version = "0.0.1"
> description = " < APP DESCRIPTION !!!!!!!!!!!!!!!!! > "
> authors = ["you"]
> license = ""
> repository = ""
> default-run = "app"
> edition = "2021"
> rust-version = "1.60"
>
> # See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html
>
> [build-dependencies]
> tauri-build = { version = "1.4.0" }
>
> [dependencies]
> serde_json = "1.0"
> serde = { version = "1.0", features = ["derive"] }
> tauri = { version = "1.4.0", features = ["windows7-compat"] }
>
> [features]
> # this feature is used for production builds or when `devPath` points to the filesystem and the built-in dev server is disabled.
> # If you use cargo directly instead of tauri's cli you can use this feature flag to switch between tauri's `dev` and `build` modes.
> # DO NOT REMOVE!!
> custom-protocol = ["tauri/custom-protocol"]
> ```

Add extra settings for Tauri config.

> `tauri.conf.json`
>
> ```
> {
>   "build": {
>     "beforeBuildCommand": "pnpm vite build",
>     "beforeDevCommand": "pnpm vite dev",
>     "devPath": "http://localhost:5180",
>     "distDir": "../build"
>   },
>   "tauri": {
>     "allowlist": {
>       "all": false,
>       "fs": {
>         "scope": ["$RUNTIME/*"]
>       }
>     },
>     "bundle": {
>       "windows": {
>         "webviewInstallMode": {
>           "type": "offlineInstaller"
>         }
>       }
>     }
>   }
> }
> ```

> `rustfmt.toml`
>
> ```
> tab_spaces = 2
> ```

_**GOTCHA:**_ Do not put `./*` in the `resources` array under `bundle` in the tauri config.

```
  "bundle": {
    "resources": [],
```

Startup the app!

```
pnpm dev
```

# Build

https://tauri.app/v1/guides/building/windows

```
pnpm build
```

# Add a Command

```
pnpm add @tauri-apps/api
```

> `src-tauri\src\main.rs`
>
> ```
> // Prevents additional console window on Windows in release, DO NOT REMOVE!!
> #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
>
> fn main() {
>   tauri::Builder::default()
>     .invoke_handler(tauri::generate_handler![greet])
>     .run(tauri::generate_context!())
>     .expect("error while running tauri application");
> }
>
> #[tauri::command]
> fn greet(name: &str) -> String {
>   format!("Hello, {}!", name)
> }
> ```

> `src\lib\Greet.svelte`
>
> ```
> <script>
>   import { invoke } from '@tauri-apps/api/tauri';
>
>   let name = '';
>   let greetMsg = '';
>
>   async function greet() {
>     greetMsg = await invoke('greet', { name });
>   }
> </script>
>
> <div>
>   <input id="greet-input" placeholder="Enter a name..." bind:value={name} />
>   <button on:click={greet}>Greet</button>
>   <p>{greetMsg}</p>
> </div>
> ```

> `src\routes\+page.svelte`
>
> ```
> <script>
>   import Greet from '../lib/Greet.svelte';
> </script>
>
> <h1>Welcome to SvelteKit</h1>
> <Greet />
> ```
