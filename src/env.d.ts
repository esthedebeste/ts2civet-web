/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_TS2CIVET_VERSION: string
	readonly VITE_TYPESCRIPT_VERSION: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
