export const toBase64Url = (data: string) =>
	btoa(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")

export const fromBase64Url = (data: string) => atob(data.replace(/-/g, "+").replace(/_/g, "/"))
