import { API_URL } from "./config.ts"

type FetchApiOptions = {
	url: string
	qs?: Record<string, any>
	signal?: AbortSignal
	token?: string | null
	headers?: Record<string, string>
	body?: BodyInit | null | undefined
	hasFiles?: boolean
}

type RequestOptions = {
	headers?: Record<string, string>
	body?: BodyInit | null | undefined
	hasFiles?: boolean
	token?: string | null
	signal?: AbortSignal
}

type UrlParamsOptions = {
	urlString: string
	objParams?: Record<string, any>
}

class FetchApi {
	baseUrl: string;
	[key: string]: any
	constructor() {
		this.baseUrl = API_URL || ""
		this.get = this.get.bind(this)
		this.post = this.post.bind(this)
		// this.patch = this.patch.bind(this)
		// this.put = this.put.bind(this)
		// this.delete = this.delete.bind(this)
		this.getHeaders = this.getHeaders.bind(this)
		this.getUrlWithParams = this.getUrlWithParams.bind(this)
		this.requestPostOptions = this.requestPostOptions.bind(this)
	}

	async get({ 
		url,
		qs,
		signal,
		token,
		headers 
	}: FetchApiOptions) {
		const res = await fetch(
			this.getUrlWithParams({ urlString: this.baseUrl + url, objParams: qs }),
			this.requestGetOptions({ signal, token, headers })
		)
		return this.wrapResponse(res)
	}

	async post({
		url,
		body,
		headers,
		hasFiles,
		qs,
		token,
		signal,
	}: FetchApiOptions) {
		const res = await fetch(
			this.getUrlWithParams({ urlString: this.baseUrl + url, objParams: qs }),
			this.requestPostOptions({ headers, body, hasFiles, token, signal })
		)
		return this.wrapResponse(res)
	}

	async patch({
		url,
		body,
		headers,
		hasFiles,
		qs,
		token,
		signal,
	}: FetchApiOptions) {
		const res = await fetch(
			this.getUrlWithParams({ urlString: this.baseUrl + url, objParams: qs }),
			this.requestPatchOptions({ headers, body, hasFiles, token, signal })
		)
		return this.wrapResponse(res)
	}

	async put({
		url,
		body,
		headers,
		hasFiles,
		qs,
		token,
		signal,
	}: FetchApiOptions) {
		const res = await fetch(
			this.getUrlWithParams({ urlString: this.baseUrl + url, objParams: qs }),
			this.requestPutOptions({ headers, body, hasFiles, token, signal })
		)
		return this.wrapResponse(res)
	}

	async delete({
		url,
		body,
		headers,
		qs,
	}: FetchApiOptions) {
		const res = await fetch(
			this.getUrlWithParams({ urlString: this.baseUrl + url, objParams: qs }),
			this.requestDeleteOptions({ headers, body, })
		)
		return this.wrapResponse(res)
	}


	wrapResponse(res: Response) {
		return {
			ok: res.ok,
			status: res.status,
			headers: res.headers,
			url: (res as any).url,
			text: async () => await res.text(),
			json: async () => {
				try {
					return await res.json()
				} catch (e) {
					return null
				}
			},
		}
	}

	requestGetOptions({ headers, signal, token }: RequestOptions) {
		return {
			method: "GET",
			headers: this.getHeaders({ headers, token }),
			signal,
		}
	}

	requestPostOptions({
		headers,
		body,
		signal,
		hasFiles,
		token,
	}: RequestOptions) {
		return {
			method: "POST",
			headers: this.getHeaders({ headers, hasFiles, token }),
			body: hasFiles ? body : JSON.stringify(body),
			signal,
		}
	}

	requestPatchOptions({ headers = {}, body, hasFiles, token }: RequestOptions) {
		return {
			method: "PATCH",
			headers: this.getHeaders({ headers, token, hasFiles }),
			body: hasFiles ? body : JSON.stringify(body),
		}
	}

	requestPutOptions({ headers = {}, body, hasFiles, token }: RequestOptions) {
		return {
			method: "PUT",
			headers: this.getHeaders({ headers, token, hasFiles }),
			body: hasFiles ? body : JSON.stringify(body),
		}
	}

	requestDeleteOptions({ headers = {}, body, token }: RequestOptions) {
		return {
			method: "DELETE",
			headers: this.getHeaders({ headers, token }),
			body: JSON.stringify(body),
		}
	}

	getUrlWithParams({ urlString, objParams }: UrlParamsOptions) {
		if (objParams && Object.keys(objParams).length === 0) return urlString

		const url = new URL(urlString)
		url.search = new URLSearchParams(objParams).toString()
		return url
	}
}

export default new FetchApi()
