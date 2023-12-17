<script lang="ts">
	import { replaceState } from "$app/navigation"
	import { fromBase64Url, toBase64Url } from "$lib/base64url"
	import { javascript } from "@codemirror/lang-javascript"
	import { oneDark } from "@codemirror/theme-one-dark"
	import { untrack } from "svelte"
	import CodeMirror from "svelte-codemirror-editor"
	import { transform } from "ts2civet"

	let addNewLines = $state(true)

	function initial() {
		if (location.hash) {
			const hash = location.hash.slice(1)
			return fromBase64Url(hash)
		} else
			return `\
function add(a: number, b: number): number {
	return a + b;
}`
	}

	let typescript = $state(`function add(a: number, b: number): number {
    return a + b;
}`)
	$effect.pre(() => {
		const dontAddNewlinesQuery = matchMedia("(max-width: 768px)")
		function onchange() {
			untrack(() => (addNewLines = !dontAddNewlinesQuery.matches))
		}
		dontAddNewlinesQuery.addEventListener("change", onchange)
		onchange()
		return () => {
			dontAddNewlinesQuery.removeEventListener("change", onchange)
		}
	})
	$effect(() => {
		const hash = toBase64Url(typescript)
		location.hash = hash
		replaceState("#" + hash, "")
	})
	function transforms(code: string) {
		try {
			const transformed = transform(code, "hi.tsx", { header: false }).trim()
			if (addNewLines) {
				const newlines = code.split("\n").length
				// add newlines to the end of the transformed code to match the number of newlines in the original code
				const newlinesToAdd = newlines - transformed.split("\n").length
				if (newlinesToAdd < 0) return transformed
				return transformed + "\n".repeat(newlinesToAdd)
			} else return transformed
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
		align-items: center;
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
