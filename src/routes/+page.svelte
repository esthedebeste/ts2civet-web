<script lang="ts">
	import { browser } from "$app/environment"
	import { replaceState } from "$app/navigation"
	import { page } from "$app/stores"
	import { fromBase64Url, toBase64Url } from "$lib/base64url"
	import { javascript } from "@codemirror/lang-javascript"
	import { oneDark } from "@codemirror/theme-one-dark"
	import CodeMirror from "svelte-codemirror-editor"
	import { transform } from "ts2civet"

	const DEFAULT = `\
function add(a: number, b: number): number {
	return a + b;
}`

	function initial() {
		if (browser && $page.url.searchParams.has("code")) {
			const search = $page.url.searchParams.get("code")!
			return fromBase64Url(search)
		} else return DEFAULT
	}

	let typescript = $state(initial())
	$effect(() => {
		const search = toBase64Url(typescript)
		replaceState("?code=" + search, {})
	})
	function transforms(code: string) {
		try {
			return transform(code, "hi.tsx", { header: false }).trim()
		} catch (error) {
			return String(error)
		}
	}

	let civet = $derived(transforms(typescript))
</script>

<h1><a href="https://github.com/esthedebeste/ts2civet">ts2civet</a> demo</h1>
<main>
	<div class="typescript">
		<h2>
			Typescript <span class="ts-version">{import.meta.env.VITE_TYPESCRIPT_VERSION}</span>
		</h2>
		<CodeMirror
			bind:value={typescript}
			class="editor"
			lang={javascript({ jsx: true, typescript: true })}
			theme={oneDark}
		/>
	</div>
	<div class="civet">
		<h2>
			Civet output - ts2civet
			<span class="ts2civet-version">{import.meta.env.VITE_TS2CIVET_VERSION}</span>
		</h2>
		<CodeMirror
			value={civet}
			class="editor"
			readonly
			lang={javascript({ jsx: true, typescript: true })}
			theme={oneDark}
			styles={{ "&": { height: "100%" } }}
		/>
	</div>
</main>

<style>
	h1,
	h2 {
		text-align: center;
	}

	a {
		color: #ff8800;
	}

	a:visited {
		color: #ffae00;
	}

	main {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 100%;
		margin: 0 auto;
	}

	.ts2civet-version,
	.ts-version {
		font-family: monospace;
		font-weight: bold;
	}

	.ts2civet-version {
		color: #ff8800;
	}
	.ts-version {
		color: #007acc;
	}

	div {
		background-color: #ffffff05;
		border: 1px solid;
	}

	.typescript {
		border-color: #007acc44;
		box-shadow: 0 0 10px #08c5;
	}

	.civet {
		border-color: #ff880044;
		box-shadow: 0 0 10px #f805;
	}

	:global(.editor),
	div {
		flex: 1;
		height: 100%;
		margin: 1em;
		border-radius: 6px;
	}

	@media (max-width: 768px) {
		main {
			flex-direction: column;
		}
	}

	@media (min-width: 768px) {
		main {
			max-width: 1200px;
		}
	}
</style>
