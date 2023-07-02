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
>   "build": "tauri build",
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
> /src-tauri
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
   `http://localhost:5173`

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

Add a Command

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

```
pnpm tauri dev
```

# Build

https://tauri.app/v1/guides/building/windows

```
pnpm build
```
