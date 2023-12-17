import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"
import * as ts2civet from "./node_modules/ts2civet/package.json"

process.env.VITE_TYPESCRIPT_VERSION = ts2civet.dependencies.typescript.replace(/\d/, "v$&")
process.env.VITE_TS2CIVET_VERSION = ts2civet.version.replace(/\d/, "v$&")
export default defineConfig({
	plugins: [sveltekit()],
})
